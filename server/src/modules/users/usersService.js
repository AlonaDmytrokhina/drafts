import * as usersRepository from "./usersRepository.js";
import * as patchUtils from "../fanfics/fanficsUtils.js";
import * as fanficsRepository from "../fanfics/fanficsRepository.js";

const usedFields = ['username', 'bio', 'avatar_url'];

export const patchUser = async (user, body) => {
    const id = user.id;

    const info = patchUtils.getPatchInfo(body, usedFields);

    const fields = info.fields;
    const values = info.values;
    let index = info.index;

    // for(const field of usedFields){
    //     if(body[field] !== undefined){
    //         fields.push(`${field} = $${index}`);
    //         values.push(body[field]);
    //         index++;
    //     }
    // }
    //
    // if (fields.length === 0) {
    //     throw new Error('No fields to update');
    // }

    return await usersRepository.updateUser({fields, values, index, id});
};

export const deleteUser = async (id) => {
    return await usersRepository.deleteUserById(id);
};

export const getUserById = async (id) => {
    return await usersRepository.getUserById(id);
};

export const getUserByUsername = async (username) => {
    return await usersRepository.getUserByUsername(username);
};

export const allUserWorks = async (username, filters) => {
    const user = await usersRepository.getUserByUsername(username);
    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }
    return fanficsRepository.findFanfics({
        authorId: user.id,
        ...filters,
    });
};





