import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import commentService from "../services/comment";
import { toast } from "react-toastify";


//! yeni bir yorum oluşturulduğunda veya silindiğince yapılan bu 
//! değişikliğin ekrana yansıması lazım usecomment in vs tekrar devreye girmesi lazım
//! bu yüzden 

//! EĞERKİ YENİ BİR YORUM OLUŞTURMA BAŞARILI OLURSA YORUM VERİLERİNİ TEKRARDAN ÇEK 
//!  INVALIDATEQuerıes = COMMENT SORGUSUNU YENİDEN ÇALIŞTIR



const useCommments = (blogId:string) =>
    

    useQuery({
        queryKey:["comments", blogId],
        queryFn: () => commentService.getAll(blogId),
        enabled: !!blogId, 
        //! blogId varsa sorgu çalıştır, yoksa çalıştırma
        //! blogId ? true : false,
        //! Boolean(blogId)
        //! !! bir değeri js de boolean a çevirir
    });


    const useCreateComment = () =>{
        const queryClient = useQueryClient();

      return  useMutation({
    mutationFn: ({blogId, content}: {blogId:string; content:string})  => 
        commentService.create(blogId,content),
    //! EĞERKİ YENİ BİR YORUM OLUŞTURMA BAŞARILI OLURSA YORUM VERİLERİNİ TEKRARDAN ÇEK 
    //!  INVALIDATEQuerıes = COMMENT SORGUSUNU YENİDEN ÇALIŞTIR
    onSuccess:() => queryClient.invalidateQueries({queryKey:["comments"] }),
    onError:() => toast.error("Yorum oluşturuldu")      
});
    };

        const useDeleteComment = () =>{

            const queryClient = useQueryClient();

         return   useMutation({
                mutationFn: ({blogId, commentId} : {blogId:string; commentId: string}) =>
                    commentService.delete(blogId,commentId),
    //! EĞERKİ YENİ BİR YORUM OLUŞTURMA BAŞARILI OLURSA YORUM VERİLERİNİ TEKRARDAN ÇEK 
    //!  INVALIDATEQuerıes = COMMENT SORGUSUNU YENİDEN ÇALIŞTIR
           onSuccess:() => queryClient.invalidateQueries({queryKey: ["comments"] }),
           onError:() => toast.error("Yorum oluşturuldu")      

        });
            }

            export { useCommments, useCreateComment,useDeleteComment };