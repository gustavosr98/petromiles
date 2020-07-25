import { ExampleService } from './example.service';

describe('CatsController', () => {
  let exampleService: ExampleService;

  beforeEach(() => {
    exampleService = new ExampleService();
  });

  describe('test', () => {
    it('should return a hello string', async () => {
      const result = 'I am working!';
      expect(exampleService.test()).toBe(result);
    });
  });
});
