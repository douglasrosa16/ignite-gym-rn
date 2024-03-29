# Projeto 3 - Ignite Rocketseat com React Native

## 1º - Criaçao do projeto:
  npx create-expo-app --template
   - Utilizando typescript como template

## 2º - Definindo a estrutura de mapeamento
npm install --save-dev babel-plugin-module-resolver

## 3º - Incluindo fontes na aplicação
npx expo install expo-font @expo-google-fonts/roboto

https://docs.expo.dev/develop/user-interface/fonts/#use-a-google-
### - Realiza a importação
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

### - Carrega as fontes, caso tenha carregado corretamente irá alterar a variável fontsLoaded para true
const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

## Biblioteca de Componentes - Native Base
Instalando a biblioteca
 - npm install native-base
 - npx expo install react-native-svg@12.1.1
 - npx expo install react-native-safe-area-context@3.3.2

## 4º React Navigation (Navegação da aplicação)
-> Core da navegação
  - npm install @react-navigation/native
-> Dependências de navegação
  - npx expo install react-native-screens react-native-safe-area-context
  -> React native screen: responsável pela transição entre telas
  -> Safe area Context: para os elementos serem exibidos de forma segura na tela
-> Utilizar como estratégia de navegação para as rotas de autenticação
  - npm install @react-navigation/native-stack
-> Estratégia de navegação com bottom tab
  - npm install @react-navigation/bottom-tabs

### Utilizando SVG - React Native SVG Transformer
  [doc]: https://github.com/kristerkari/react-native-svg-transformer
  - npm i react-native-svg-transformer --save-dev
  - Configuração do metro config

## Erros e Soluções
### Native base
- Erro: In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app
- Solução: https://github.com/GeekyAnts/NativeBase/issues/5758
Abra o arquivo node_modules/native-base/src/core/NativeBaseProvider.tsx
Na linha 97 altere <SSRProvider>{children}</SSRProvider> para:
{
  React.version >= '18' ? children : <SSRProvider>{children}</SSRProvider>
}

### Yup Resolver
- Type 'Resolver<{ name: string; email: string; }>' is not assignable to type 'Resolver<FormDataProps,>
- Solução: npm i yup@latest e também tive que colocar todos os campos dentro do Schema para ele parar de ocorrer o erro


## Tipos Typescript
### Cria uma pasta @types
  - Tipo de Imagem
    Cannot find module '@assets/Background.png' or its corresponding type declarations.ts(2307)
  - Cria o arquivo "png.d.ts"
  - Coloca o conteúdo nele: declare module "*.png";

  - SVG
  - Cria o arquivo "svg.d.ts"
  declare module "*.svg" {
    import React from "react";
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
  }

## Image Picker
- Biblioteca do expo para utilizar fotos no celular

## Validação de Formulários
Instalação: npm install react-hook-form
O React Hook Form controla os Inputs dos objetos e consegue realizar uma validação nos campos

## Yup - Biblioteca de validação baseada em schemas 
Instalação: npm install @hookform/resolvers yup

## Integração com Backend
- Axios: realiza a integração de uma maneira mais simples que o fetch do JS
Instalação: npm install axios

## Persistindo os dados na aplicação
- Para persistir o usuário logado na aplicação pode ser usado o AsyncStorage do EXPO
- Instalação: npx expo install @react-native-async-storage/async-storage
- Dessa forma é possível salvar na storage do APP

## JWT (JSON Web Token)
- Autenticação JWT: meio para troca de informações no fluxo de autenticação
- Composto por: 
  - Header
  - Payload
  - Verificação de assinatura

## Token
- É um artefato que permite que o Backend identifique o usuário e com isso autorize a requisição
- Dois pilares: 
  - Autenticação: confirmação da identidade do usuário, exemplo fluxo de login
  - Autorização: verificação de quais recursos o usuário pode utilizar, nível de acesso

### Refresh Token
1. Usuário envia requisição com token
2. Back-end valida token 
3. Intercepta a resposta do back-end (Middleware)
4. Coloca a requisição na fila de espera
5. Obtém token atual
6. Busca novo token no back-end
7. Atualiza token no Headers e no dispositivo
8. Processa requisições da fila de espera
9. Retorna a requisição se for sucesso, ou Desloga o usuário