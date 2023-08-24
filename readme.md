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

### Erros e Soluções
#### Native base
- Erro: In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app
- Solução: https://github.com/GeekyAnts/NativeBase/issues/5758
Abra o arquivo node_modules/native-base/src/core/NativeBaseProvider.tsx
Na linha 97 altere <SSRProvider>{children}</SSRProvider> para:
{
  React.version >= '18' ? children : <SSRProvider>{children}</SSRProvider>;
}