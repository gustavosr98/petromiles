declare namespace App {
  namespace Auth {
    interface UserClient {
      user: import('../src/modules/client/user-client/user-client.entity').UserClient;
      userDetails: import('../src/modules/user/user-details/user-details.entity').UserDetails;
      role: import('../src/modules/management/role/role.enum').Role;
    }

    interface JWTPayload {
      email: string;
    }

    interface Response {
      email: string;
      userDetails: object;
      token: string;
      role: import('../src/modules/management/role/role.enum').Role;
      language: string;
    }
  }

  namespace SendGrid {
    interface Mail {
      to: string;
      from: string;
      subject: string;
      templateId: string;
      dynamic_template_data: object;
    }
  }
}
