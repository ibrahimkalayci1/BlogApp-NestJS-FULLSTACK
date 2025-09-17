import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blog";
import type { CreateBlogValues, GetBlogParams } from "../types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useBlogs = (params?:GetBlogParams) =>
    useQuery({
        queryKey: ["blogs",params], //! parametreler her değiştiğinde çalışsın diye parametreleri verdik
        queryFn: () => blogService.getAll(params),
    });



    const useOwnBlogs = (params?:GetBlogParams) =>
    useQuery({
        queryKey: ["own-blogs",params], //! parametreler her değiştiğinde çalışsın diye parametreleri verdik
        queryFn: () => blogService.getOwn(params),
    });


const useBlog = (id: string) =>
    useQuery({
        queryKey: ["blog", id],
        queryFn:() => blogService.getById(id),
        enabled:!!id,
    });

const useCreateBlog = () => {
    const queryClient = useQueryClient();
     const navigate= useNavigate();

    return useMutation({
        mutationFn: (values: CreateBlogValues) => blogService.create(values), 
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ["blogs"]});
            toast.success("Blog başarıyla oluşturuldu");
            navigate(`/blog/${data.id}`);
        },
        onError: () => {
            toast.error("Blog Oluşturulamadı")
        },
    })
}

const useUpdateBlog = () => {
    const queryClient = useQueryClient();
     const navigate= useNavigate();

    return useMutation({
        mutationFn: ({id,values}:{id:string;values: CreateBlogValues}) => blogService.update(id,values), 
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ["blogs"]});
            toast.success("Blog başarıyla güncellendi");
            navigate(`/blog/${data.id}`);
        },
        onError: () => {
            toast.error("Blog Güncellenemedi")
        },
    })
}

const useDeleteBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id:string) => blogService.delete(id), 
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["own-blogs"]});
            toast.success("Blog Başarıyla Silindi");
            
        },
        onError: () => {
            toast.error("Blog Silinemedi")
        },
    })
}

    export {useBlogs,useBlog,useCreateBlog,useUpdateBlog,useOwnBlogs,useDeleteBlog}