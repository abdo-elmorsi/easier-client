import axios from "helper/apis/httpRequest";

export const updateImage = async (image) => {
    const response = await axios({
        method: "post",
        url: "users/upload",
        data: image,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
