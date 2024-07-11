import { Input } from "@/components/Input";
import { Image, Text, View } from "react-native";
import { ArrowRight, Calendar as CalendarIcon, MapPin, Settings2, UserRoundPlus } from "lucide-react-native"
import { colors } from "@/styles/colors";
import { Button } from "@/components/Button";
import { useState } from "react";

enum StepForm {
  TRIP_DETAIL = 1,
  ADD_EMAIL = 2
}

export default function Index() {
  const [stepForm, setStepForm] = useState<StepForm>(StepForm.TRIP_DETAIL)

  function handleNextStepForm() {
    if (stepForm === StepForm.TRIP_DETAIL) {
      return setStepForm(StepForm.ADD_EMAIL)
    }
  }

  return (
    <View className="flex-1 items-center justify-center px-5">
      <Image
        src={require("@/assets/logo.png")}
        className="h-8"
        resizeMode="contain"
      />

      <Image
        src={require("@/assets/bg.png")}
        className="absolute"
      />

      <Text className="text-zinc-400 font-regular text-center text-lg mt-3">
        Convide seus amigos e planeje sua {'\n'}próxima viagem
      </Text>

      <View className="w-full bg-zinc-900 p-4 border border-zinc-800 rounded-lg my-8 ">
        <Input>
          <MapPin color={colors.zinc[400]} size={20} />
          <Input.Field placeholder="Para onde?" editable={stepForm === StepForm.TRIP_DETAIL} />
        </Input>

        <Input>
          <CalendarIcon color={colors.zinc[400]} size={20} />
          <Input.Field placeholder="Quando?" editable={stepForm === StepForm.TRIP_DETAIL} />
        </Input>
        {stepForm === StepForm.ADD_EMAIL && (
          <>
            <View className="border-b py-3 border-zinc-800">
              <Button variant="secondary" onPress={() => setStepForm(StepForm.TRIP_DETAIL)}>
                <Button.Title>Alterar local/data</Button.Title>
                <Settings2 color={colors.zinc[200]} size={20} />
              </Button>
            </View>

            <Input>
              <UserRoundPlus color={colors.zinc[400]} size={20} />
              <Input.Field placeholder="Quem estará na viagem?" />
            </Input>
          </>
        )}
        <Button onPress={handleNextStepForm}>
          <Button.Title>
            {
              stepForm === StepForm.ADD_EMAIL ? 'Confirmar Viagem' : 'Continuar'
            }
          </Button.Title>
          <ArrowRight color={colors.lime[950]} size={20} />
        </Button>
      </View>

      <Text className="text-center text-zinc-500 font-regular text-base">
        Ao planejar sua viagem com a plann.er você automaticamente
        com os nossos{" "} <Text className="text-zinc-300 underline"> termos de uso e políticas de privacidade.</Text>
      </Text>

    </View>
  )
}