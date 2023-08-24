# Projeto 3 - Ignite Rocketseat com React Native

## 1º - Criaçao do projeto:
  npx create-expo-app --template

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

### Utilizando SVG - React Native SVG Transformer
  [doc]: https://github.com/kristerkari/react-native-svg-transformer
  - npm i react-native-svg-transformer --save-dev
  - Configuração do metro config

## Erros e Soluções
#### Native base
- Erro: In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app
- Solução: https://github.com/GeekyAnts/NativeBase/issues/5758
Abra o arquivo node_modules/native-base/src/core/NativeBaseProvider.tsx
Na linha 97 altere <SSRProvider>{children}</SSRProvider> para:
{
  React.version >= '18' ? children : <SSRProvider>{children}</SSRProvider>;
}

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

