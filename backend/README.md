# Kinemo Alert — Backend BC03 (DDD + CQRS)

Java 21 · Spring Boot 3.5.16 · Maven · Spring Data JPA · H2 (local) · Spring Security.

This is the backend for **BC03 Crisis Alert Management**, isolated from the Angular frontend in the `backend/` directory. It is designed to be moved into a dedicated backend repository when the organization creates one.

## Architecture (DDD)

```text
src/main/java/com/neurosync/kinemo/
├── KinemoBackendApplication.java
├── crisisalert/
│   ├── domain/
│   │   ├── model/                 # CrisisAlert aggregate, status, domain rules
│   │   └── repository/            # Persistence ports (no Spring/JPA)
│   ├── application/
│   │   ├── command/               # Write intents (CQRS)
│   │   ├── query/                 # Read intents (CQRS)
│   │   ├── handler/               # Command and query handlers
│   │   ├── dto/
│   │   └── port/                  # BC02 authorization boundary (ACL)
│   ├── infrastructure/
│   │   ├── persistence/           # JPA entities & repository adapters
│   │   └── carenetwork/           # Temporary BC02 authorization adapter
│   └── interfaces/
│       └── rest/                  # REST API and error mapping
└── infrastructure/config/         # Local demo identity and database fixtures
```

**DDD:** the domain is framework-independent; JPA exists only in infrastructure. The aggregate enforces `ACTIVE → ATTENDED → CLOSED`. **CQRS:** separate command/query records and handlers. **Anti-Corruption Layer:** BC03 depends on `CareNetworkAuthorizationPort` instead of on the real BC02 implementation. The database includes a uniqueness constraint on `(child_id, open_slot)` so only one non-closed alert may exist per child.

## Open and run in IntelliJ IDEA

1. Open the `backend` directory as a project, or choose the `backend/pom.xml` file and import it as Maven.
2. Configure **Project SDK: Java 21** and let IntelliJ download Maven dependencies.
3. Select `KinemoBackendApplication` → **Run → Edit Configurations**.
4. Set **Active profiles** to `local` (or add VM options: `-Dspring.profiles.active=local`).
5. Run the application. Server URL: `http://localhost:8080`.
6. Open `kinemo-alert.http` in IntelliJ and run the requests using the green play icons.
7. Run tests via Maven: `mvn test`.

## Local-only demo credentials

- `caregiver-alert-001` / `demo123`
- `caregiver-alert-002` / `demo123`

Both caregivers are authorized for `child-001` in seeded local H2 data. Credentials exist only with the `local` profile. **All API requests are denied when the `local` profile is not active**, until authentication through BC01 is implemented. Do not expose the local profile to the internet.

## REST endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/crisis-alerts` | Create SOS alert (201) |
| GET | `/api/v1/crisis-alerts?childId=child-001` | View child alerts |
| PATCH | `/api/v1/crisis-alerts/{id}/attend` | Mark alert as attended |
| PATCH | `/api/v1/crisis-alerts/{id}/close` | Close attended alert |
| GET | `/api/v1/crisis-alerts/notifications` | View authenticated caregiver's internal notices |

Create request:
```json
{"childId":"child-001","description":"Necesita acompañamiento"}
```

The server obtains the caregiver identity from the authenticated principal, **not from the request body**. API errors use a stable `code` and `message` field. All operations require authentication.

## Integration requirements and known limits

- The frontend BC03 currently uses JSON Server on `localhost:3000`. To connect it to this API, replace its infrastructure HTTP repository and map the response DTOs. Do **not** remove the existing Angular domain/application/presentation separation.
- The internal notice table stores `IN_APP/QUEUED` messages; there is **no real SMS, push delivery, or emergency dispatch**. The response's `queuedNotices` count is not proof of delivery.
- Real BC02 integration must replace the temporary authorization adapter; real BC01 integration must replace local Basic auth. Never deploy local demo credentials.
- H2 is an ephemeral development database and is not intended for production.
- Clinical advice, automatic diagnosis, child-worn devices and real-time wearable triggers are outside this BC's scope.
- Use proper HTTPS, production DB migrations, observability, rate limits, data-retention policy and security reviews before deployment.
- This implementation must not be presented as production-ready until dependencies are installed and the test suite passes in IntelliJ/CI.

## Test coverage

Unit tests cover immutable aggregate lifecycle and validation. Integration tests use the `local` profile, MockMvc, real H2, repository adapters, security and notification queue.
