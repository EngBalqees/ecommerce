export const pagination = (page, limit) => {
    // Default values for page and limit
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 2;

    // Validate that page and limit are positive integers
    if (page <= 0) {
        page = 1;
    }
    if (limit <= 0) {
        limit = 2;
    }

    // Calculate the number of records to skip based on the page
    const skip = (page - 1) * limit;

    return { skip, limit };
};
