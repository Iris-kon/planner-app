import { Input } from "@/components/input";
import { Alert, Image, Keyboard, Text, View } from "react-native";
import { ArrowRight, AtSign, Calendar as CalendarIcon, MapPin, Settings2, UserRoundPlus } from "lucide-react-native"
import { colors } from "@/styles/colors";
import { Button } from "@/components/button";
import { useEffect, useState } from "react";
import { Modal } from "@/components/modal";
import { Calendar } from "@/components/calendar";
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils";
import { DateData } from "react-native-calendars";
import dayjs from "dayjs";
import { GuestEmail } from "@/components/email";
import { validateInput } from "@/utils/validateInput";
import { tripStorage } from "@/storage/trip";
import { router } from "expo-router";
import { tripServer } from "@/server/trip-server";
import { Loading } from "@/components/Loading";

enum StepForm {
  TRIP_DETAIL = 1,
  ADD_EMAIL = 2
}

enum MODAL {
  NONE = 0,
  CALENDAR = 1,
  GUEST = 2
}

export default function Index() {
  const [isCreatingTrip, setisCreatingTrip] = useState(false)
  const [isGettingTrip, setIsGettingTrip] = useState(true)

  const [selectedDate, setSelectedDates] = useState({} as DatesSelected)
  const [destination, setDestination] = useState('')
  const [emailToInvite, setEmailToInvite] = useState('')
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])
  const [stepForm, setStepForm] = useState(StepForm.TRIP_DETAIL)

  const [showModal, setShowModal] = useState(MODAL.NONE)

  function handleNextStepForm() {
    if(destination.trim().length > 0 || !selectedDate.startsAt || !selectedDate.endsAt) {
      return Alert.alert(
        "Detalhes da viagem",
        "Preencha todas as informações da viagem para seguir."
      )
    }

    if(destination.trim().length < 4) {
      return Alert.alert(
        "Destino deve ter mais de 4 caracteres"
      )
    }

    if (stepForm === StepForm.TRIP_DETAIL) {
      return setStepForm(StepForm.ADD_EMAIL)
    }

    Alert.alert(
      "Nova viagem",
      "Confirmar viagem?",
      [
        {
          text: 'Não',
          style: 'cancel'
        },
        {
          text: 'Sim',
          onPress: createTrip
        }
      ]
    )
  }

  function handleSelectedDates(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDate.startsAt,
      endsAt: selectedDate.endsAt,
      selectedDay
    })

    setSelectedDates(dates)
  }

  function handleRemoveEmail(emailToRemove: string) {
    setEmailsToInvite((prevState) => prevState.filter(e => e !== emailToRemove))
  }

  function handleAddEmail() {
    if(!validateInput.email(emailToInvite)) {
      return Alert.alert(
        "Convidado",
        "E-mail inválido!"
      )
    }

    const emailAlreadyExists = emailsToInvite.find(email => email === emailToInvite)

    if(emailAlreadyExists) {
      return Alert.alert(
        "Convidado",
        "E-mail já foi adicionado!"
      )
    }

    setEmailsToInvite((prevState) => { return [ ...prevState, emailToInvite ]})
  }

  async function saveTrip(tripId: string) {
    try {
      await tripStorage.save(tripId)
      router.navigate(`/trip/${tripId}`)

    } catch (err) {
      Alert.alert(
        "salvar viagem",
        "Não foi possível salvar o id da viagem no dispositivo!"
      )

      console.log(err)
    }
  }

  async function createTrip() {
    try {
      setisCreatingTrip(true)

      const newTrip = await tripServer.create({
        destination,
        starts_at: dayjs(selectedDate.startsAt?.dateString).toString(),
        ends_at: dayjs(selectedDate.startsAt?.dateString).toString(),
        email_to_invite: emailsToInvite
      })

      Alert.alert(
        "Nova viagem",
        "Viagem criada com sucesso!", [
          {
            text: 'OK. Continuar',
            onPress: () => saveTrip(newTrip.tripId)
          }
        ]
      )

    } catch (err) {
      console.log(err)
      setisCreatingTrip(false)
    }
  }

  async function getTrip() {
    try {
      const tripId = await tripStorage.get()

      if(!tripId) {
        return setIsGettingTrip(false)
      }
      
      const trip = await tripServer.getById(tripId)

      if(trip) {
        return router.navigate(`/trip/${trip.id}`)
      }

    } catch (err) {
      setIsGettingTrip(false)
      console.log(err)
    }
  }

  useEffect(() => {
    getTrip()
  }, [])

  if(isGettingTrip) {
    return <Loading />
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
          <Input.Field 
            placeholder="Para onde?" 
            editable={stepForm === StepForm.TRIP_DETAIL} 
            onChangeText={setDestination}
            value={destination}
            />
        </Input>

        <Input>
          <CalendarIcon color={colors.zinc[400]} size={20} />
          <Input.Field 
            placeholder="Quando?" 
            editable={stepForm === StepForm.TRIP_DETAIL} 
            onFocus={() => Keyboard.dismiss()}
            showSoftInputOnFocus={false}
            onPressIn={() => stepForm === StepForm.TRIP_DETAIL ? setShowModal(MODAL.CALENDAR) : null}
            value={selectedDate.formatDatesInText}
          />
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
              <Input.Field 
                placeholder="Quem estará na viagem?" 
                autoCorrect={false}
                value={
                  emailsToInvite.length > 0 ? `${emailToInvite.length} pessoas(a) convidada(s)` : ''
                }
                onPress={() => {
                  Keyboard.dismiss()
                  setShowModal(MODAL.GUEST)
                }}
                showSoftInputOnFocus={false}
              />
            </Input>
          </>
        )}
        <Button onPress={handleNextStepForm} isLoading={isCreatingTrip} >
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


      <Modal 
        title="Selecionar datas"
        subtitle="Selecione a data de ida e volta da viagem"
        visible={showModal === MODAL.CALENDAR}
        onClose={() => {setShowModal(MODAL.NONE)}}
      >
        <View className="gap-4 mt-4">
          <Calendar
            minDate={dayjs().toISOString()} 
            onDayPress={handleSelectedDates}
            markedDates={selectedDate.dates}
          />

          <Button onPress={() => setShowModal(MODAL.NONE)} >
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>


      <Modal
        title="Selecionar convidados"
        subtitle="Os convidados irão receber e-mails para confirmar a participação na viagem."
        visible={showModal === MODAL.GUEST}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="my-2 flex-wrap border-b border-zinc-800 py-5 items-start gap-2">
          {emailsToInvite.length > 0 ? (
            emailsToInvite.map(e => <GuestEmail key={e} email={e} onRemove={() => {handleRemoveEmail(e)}} />)
          ): <Text className="text-zinc-600 text-base font-regular">Nenhum e-mail adicionado.</Text>}
        </View>

        <View className="gap-4 mt-4"> 
            <Input variant="secondary">
              <AtSign color={colors.zinc[800]} size={20} />
              <Input.Field  
                placeholder="Digite o e-mail do convidado"
                keyboardType="email-address"
                onChangeText={(text) => setEmailToInvite(text.toLowerCase())}
                value={emailToInvite}
                returnKeyType="send"
                onSubmitEditing={handleAddEmail}
              />
            </Input>

            <Button onPress={handleAddEmail}>
              <Button.Title>Convidar</Button.Title>
            </Button>
        </View>
      </Modal>
    </View>
  )
}