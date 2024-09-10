import {roles} from '../../midleware/auth.js';

export const endPoints ={
    create : [roles.Admin],
    delete: [roles.Admin],
    getById: [roles.Admin,roles.User]
}