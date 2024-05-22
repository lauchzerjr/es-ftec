import { useCallback, useState } from "react";
import {
  CreatePostSchemaSchema,
  createPostSchema,
} from "../screens/CreatePostScreen/createPostSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { postApi } from "../../services/post.service";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../stores/authStore";
import { useNameCollectionStore } from "../stores/useNameCollectionStore";
import { useToastStore } from "../stores/useToastStore";
import { postController } from "../../controllers/post.controller";

interface Options {
  onSuccess?: (data) => void;
}

export function useCreatePost(options?: Options) {
  const user = useAuthStore((state) => state.user);
  const showToast = useToastStore((state) => state.showToast);

  const { nameCollection, courseName } = useNameCollectionStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { control, formState, handleSubmit, getValues } =
    useForm<CreatePostSchemaSchema>({
      resolver: zodResolver(createPostSchema),
      defaultValues: {
        subjectPost: "",
        disciplinePost: "",
        textPost: "",
      },
      mode: "onChange",
    });

  const uploadPostPhoto = useCallback(async (uri: string) => {
    try {
      const { task, ref } = await postApi.uploadPostPhoto(
        uri,
        user.uid,
        nameCollection
      );

      task.then(async () => {
        const url = await ref.getDownloadURL();
        setSelectedImage(url);
      });
    } catch (error) {
      console.log("Erro ao fazer upload da imagem do post => ", error);
    }
  }, []);

  const pickImageGallery = async () => {
    try {
      setIsLoading(true);
      if (ImagePicker.PermissionStatus.UNDETERMINED) {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      const galleryStatus = await (
        await ImagePicker.getMediaLibraryPermissionsAsync()
      ).granted;

      if (!galleryStatus) {
        showToast({
          message: "Você não autorizou o uso da galeria",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        selectionLimit: 10,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Erro ao abrir a galeria => ", error);
    }
  };

  const handleCreatePost = async () => {
    try {
      if (selectedImage) {
        await uploadPostPhoto(selectedImage);
      }

      const post = await postController.createPost({
        nameCollection,
        userId: user.uid,
        disciplinePost: getValues("disciplinePost"),
        subjectPost: getValues("subjectPost"),
        textPost: getValues("textPost"),
        photoPost: selectedImage,
      });
    } catch (error) {
      showToast({
        message: "Falha ao publicar post",
        type: "error",
      });
      console.log("Erro ao criar post => ", error);
    }
  };

  return {
    formState,
    courseName,
    control,
    selectedImage,
    getValues,
    setSelectedImage,
    handleSubmit,
    handleCreatePost,
    pickImageGallery,
    isLoading,
  };
}
