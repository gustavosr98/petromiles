import { Injectable } from '@nestjs/common';

@Injectable()
export class ExampleService {
  test(): string {
    return 'I am working!';
  }
}
