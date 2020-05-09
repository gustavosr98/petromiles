import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { UserAdministrator } from './user-administrator/user-administrator.entity';
import { StateName } from '../management/state/state.enum';

@Injectable()
export class UserService {
  async getUserByEmail(email: string) {
    const userFound = await getConnection().query(`
      SELECT u.email, u.password, u.salt , d.*, r.name u_role, l.name u_language
      FROM user_client u, user_details d, state s, state_user su, role r, user_role ur, language l
      WHERE u.email = '${email}'
      AND d.fk_user_client = u."idUserClient"
      AND s.name ='${StateName.ACTIVE}'
      AND s."idState"= su.fk_state
      AND su.fk_user_client = u."idUserClient"
      AND su."finalDate" is null
      AND ur.fk_user_client = u."idUserClient"
      AND ur.fk_role = r."idRole"
      AND d.fk_language = l."idLanguage"
      UNION
      SELECT u.email, u.password, u.salt , d.*, r.name u_role, l.name u_language
      FROM user_administrator u, user_details d,state s, state_user su, role r, user_role ur, language l
      WHERE u.email = '${email}'
      AND d.fk_user_client = u."idUserAdministrator"
      AND s.name ='${StateName.ACTIVE}'
      AND s."idState"= su.fk_state
      AND su.fk_user_administrator = u."idUserAdministrator"
      AND su."finalDate" is null
      AND ur.fk_user_administrator = u."idUserAdministrator"
      AND ur.fk_role = r."idRole"
      AND d.fk_language = l."idLanguage"`);

    if (userFound.length !== 0) {
      const {
        password,
        email,
        u_language,
        u_role,
        salt,
        ...userDetails
      } = userFound[0];
      const user = {
        password,
        email,
        salt,
      };
      return { user, u_language, u_role, userDetails: userDetails };
    }

    return null;
  }
}
