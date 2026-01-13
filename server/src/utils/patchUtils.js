

export const getPatchInfo = (body, usedFields) => {

    const fields = [];
    const values = [];
    let index = 1;

    for(const field of usedFields){
        if(body[field] !== undefined){
            fields.push(`${field} = $${index}`);
            values.push(body[field]);
            index++;
        }
    }

    if (fields.length === 0) {
        throw new Error('No fields to update');
    }

    return {fields, values, index};
}