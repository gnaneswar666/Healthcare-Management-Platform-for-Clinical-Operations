import api from "./api";

export const getModels = async () => {
    const res = await api.get("/model/api/models");
    return res.data;
};

export const activateModel = async (id) => {
    const res = await api.patch(`/model/api/models/${id}/activate`);
    return res.data;
};

export const addModel = async (model) => {
    const res = await api.post("/model/api/models", model);
    return res.data;
};

export const updateModel = async (id, model) => {
    const res = await api.put(`/model/api/models/${id}`, model);
    return res.data;
};

export const deleteModel = async (id) => {
    const res = await api.delete(`/model/api/models/${id}`);
    return res.data;
};