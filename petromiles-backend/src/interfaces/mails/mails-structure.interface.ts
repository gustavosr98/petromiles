export interface MailsStructure {
  to: string;
  subject: string;
  templateId: string;
  dynamic_template_data: object;
  attachments?: [
    {
      filename: string;
      type: string;
      content: string;
    },
  ];
}
