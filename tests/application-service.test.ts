import { ApplicationService, type ApplicationInput } from '@/lib/application-service';
import { StorageService } from '@/lib/storage-service';
import { MemoryStorage } from './utils/memory-storage';

describe('ApplicationService', () => {
  const createService = () => new ApplicationService(new StorageService(new MemoryStorage()));

  it('応募を作成できる', () => {
    const service = createService();
    const input: ApplicationInput = {
      jobId: 'job-001',
      candidateName: '応募 太郎',
      contactEmail: 'applicant@example.com',
      contactPhone: '08012345678',
      residenceStatus: '特定技能1号',
      jlptLevel: 'N3',
      experienceYears: 2,
      message: 'よろしくお願いいたします。',
      consentToShare: true,
    };

    const application = service.create(input);
    expect(application.id).toContain('app-');
    expect(application.status).toBe('new');

    const list = service.list();
    expect(list).toHaveLength(1);
    expect(list[0].candidateName).toBe('応募 太郎');
  });

  it('ステータスを更新できる', () => {
    const service = createService();
    const application = service.create({
      jobId: 'job-001',
      candidateName: '応募 花子',
      contactEmail: 'hanako@example.com',
      residenceStatus: '特定技能2号',
      jlptLevel: 'N2',
      consentToShare: true,
    });

    const updated = service.updateStatus(application.id, 'interview');
    expect(updated.status).toBe('interview');

    const listed = service.list();
    expect(listed[0].status).toBe('interview');
  });
});
