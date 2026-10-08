import { GuideCategory } from '../../domain/model/guide-category';

export interface PracticalGuideResource {
  id: string;
  title: string;
  category: GuideCategory;
  content: string;
}

