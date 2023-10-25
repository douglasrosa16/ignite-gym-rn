import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { FileInfo } from "expo-file-system";
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base';

import { api } from '@services/api';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppError } from '@utils/AppError';
import * as yup from 'yup';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';

const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  email: string; 
  password?: string | null | undefined;  
  confirm_password?: string | null | undefined;
  old_password?: string | null | undefined;    
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  // email: yup.string().required('Informe o email.').email(),
  // old_password: yup.string().required('Informe a senha antiga.').nullable().transform((value) => !!value ? value : null),
  password: yup.string().min(6, 'A senha deve ter pelo menos 6 dígitos.').nullable().transform((value) => !!value ? value : null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password'), ''], 'A confirmação de senha não confere.')
    .when('password', {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
        .nullable()
        .required('Informe a confirmação da senha.')       
        .transform((value) => !!value ? value : null)
    })
})

export function Profile() {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [photoIsLoading, setPhotoIsLoading] = useState<boolean>(false);
  const [userPhoto, setUserPhoto] = useState<string>('https://github.com/douglasrosa16.png');

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: yupResolver<FormDataProps>(profileSchema)
  });

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true);

      const userUpdated = user;
      userUpdated.name = data.name;
      
      await api.put('/users', data);

      await updateUserProfile(userUpdated);

      toast.show({
        title: 'Perfil atualizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      });
      
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível atualizar o usuário. Tente mais tarde'

      toast.show({
        title: title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);
    try {
      //Chama a biblioteca de fotos
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true
      });

      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        //Rocketseat apresentou dessa forma
        // const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);
        //Solução mostrada por um usuário
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri) as FileInfo;

        if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {
          toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB',
            placement: 'top',
            bgColor: 'red.500'
          })
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`
        } as any;

        console.log(photoFile);

        const userPhotoUploadForm = new FormData();

        userPhotoUploadForm.append('avatar', photoFile);

        await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        toast.show({
          title: 'Foto atualizada',
          placement: 'top',
          bgColor: 'green.500'
        })
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView>
        <Center mt={6} px={10}>
          {
            photoIsLoading ?
              <Skeleton
                w={PHOTO_SIZE}
                h={PHOTO_SIZE}
                rounded="full"
                startColor="gray.500"
                endColor="gray.400"
              />
              :
              <UserPhoto
                source={{ uri: userPhoto }}
                alt="Foto do usuário"
                size={PHOTO_SIZE}
              />
          }
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="E-mail"
                isDisabled
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />
        </Center>

        <Center px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mb={2} alignSelf="flex-start" mt={12} fontFamily="heading">
            Alterar senha
          </Heading>

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Senha antiga"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.old_password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Confirme a nova senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating}
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}
