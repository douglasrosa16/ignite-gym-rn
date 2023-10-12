import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { FileInfo } from "expo-file-system";
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  password_old: string;
  password_new: string;
  password_confirm: string;
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  password_old: yup.string().required('Informe a senha antiga.'),
  password_new: yup.string().min(6, 'A senha deve ter no mínimo 6 digitos.').required('Informe a senha'),
  password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password_new'), ''], 'A confirmação da senha não confere.')
})

export function Profile() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(profileSchema)
  });

  const [photoIsLoading, setPhotoIsLoading] = useState<boolean>(false);
  const [userPhoto, setUserPhoto] = useState<string>('https://github.com/douglasrosa16.png');

  const toast = useToast();

  function handleUpdate({ name, password_old, password_new, password_confirm }: FormDataProps) {

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

          <Input
            bg="gray.600"
            placeholder="E-mail"
            isDisabled
          />
        </Center>

        <Center px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mb={2} alignSelf="flex-start" mt={12}  fontFamily="heading">
            Alterar senha
          </Heading>

          <Controller
            control={control}
            name="password_old"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Senha antiga"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password_old?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password_new"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password_new?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Confirme a nova senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleUpdate)}
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}
