import authorities from '../config/Authorities';
import { Authority } from '../types/models/Authority.model';
import { Role } from '../types/models/Role.model';

/**
 * Set to store current user's authorities for permission checking
 */
const authoritySet = new Set<authorities>();

/**
 * AuthorityService - Service for checking user permissions/authorities
 * Manages authorization checks based on user roles and authorities.
 */
const AuthorityService = {
  /**
   * Initializes the authority set from user data stored in localStorage
   */
  initAuthoritySet: (
    user = JSON.parse(localStorage.getItem('user') || '{}')
  ) => {
    authoritySet.clear();
    const roles = user && user.roles ? user.roles : [];
    roles.forEach((role: Role) => {
      role.authorities.forEach((authority: Authority) => {
        authoritySet.add(authority.name);
      });
    });
  },

  /**
   * Checks if the current user has a specific authority
   */
  hasAuthority: (authority: authorities) => {
    AuthorityService.initAuthoritySet();
    return authoritySet.has(authority);
  },

  /**
   * Checks if the current user has all specified authorities
   */
  hasAuthorities: (authorities: authorities[]) => {
    AuthorityService.initAuthoritySet();
    for (const element of authorities) {
      if (!authoritySet.has(element)) {
        return false;
      }
    }
    return true;
  },

  /**
   * Checks if the current user has at least one of the specified authorities
   */
  hasAnyAuthority: (authorities: authorities[]) => {
    for (const element of authorities) {
      if (authoritySet.has(element)) {
        return true;
      }
    }
    return false;
  },

  /**
   * Clears all stored authorities (used on logout)
   */
  clearAuthorities: (): void => {
    authoritySet.clear();
  },
};

export default AuthorityService;
