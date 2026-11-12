package com.neurosync.kinemo.crisisalert.interfaces.rest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
class CrisisAlertIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;

    @Test
    void authorizedCaregiversCanActivateAttendAndCloseAlert() throws Exception {
        String created = mvc.perform(post("/api/v1/crisis-alerts")
                        .with(httpBasic("caregiver-alert-001", "demo123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"childId":"child-001","description":"Necesita acompañamiento"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.alert.status").value("ACTIVE"))
                .andExpect(jsonPath("$.queuedNotices").value(1))
                .andReturn().getResponse().getContentAsString();

        JsonNode alert = mapper.readTree(created).path("alert");
        String alertId = alert.path("id").asText();

        mvc.perform(get("/api/v1/crisis-alerts")
                        .param("childId", "child-001")
                        .with(httpBasic("caregiver-alert-002", "demo123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("ACTIVE"));

        mvc.perform(get("/api/v1/crisis-alerts/notifications")
                        .with(httpBasic("caregiver-alert-002", "demo123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("QUEUED"));

        mvc.perform(patch("/api/v1/crisis-alerts/{id}/attend", alertId)
                        .with(httpBasic("caregiver-alert-002", "demo123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ATTENDED"));

        mvc.perform(patch("/api/v1/crisis-alerts/{id}/close", alertId)
                        .with(httpBasic("caregiver-alert-001", "demo123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CLOSED"));
    }

    @Test
    void rejectsUnauthenticatedOrUnauthorizedRequests() throws Exception {
        mvc.perform(get("/api/v1/crisis-alerts").param("childId", "child-001"))
                .andExpect(status().isUnauthorized());

        mvc.perform(get("/api/v1/crisis-alerts")
                        .param("childId", "other-child")
                        .with(httpBasic("caregiver-alert-001", "demo123")))
                .andExpect(status().isForbidden());
    }
}
