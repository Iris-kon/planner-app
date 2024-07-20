import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { TripDetails, tripServer } from "@/server/trip-server";
import { colors } from "@/styles/colors";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { CalendarRange, Info, MapPin, Calendar as CalendarIcon, Settings2, User, Mail } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Keyboard, Text, TouchableOpacity, View } from "react-native";
import { Activities } from "../actvities";
import { Details } from "../details";
import { Modal } from "@/components/modal";
import { Calendar } from "@/components/calendar";
import { DateData } from "react-native-calendars";
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils";
import { Loading } from "@/components/Loading";
import { validateInput } from "@/utils/validateInput";
import { participantsServer } from "@/server/participants-server";
import { tripStorage } from "@/storage/trip";

export type TripData = TripDetails & { when: string }

enum MODAL {
  NONE = 0,
  CALENDAR = 1,
  UPDATE_TRIP = 2,
  CONFIRM_ATTENDANCE = 3,
}

export default function Trip() {
  const tripParams = useLocalSearchParams<{
    id: string
    participant?: string
  }>()

  const [isLoadingTrip, setIsLoadingTrip] = useState(true)
  const [isUpdatingTrip, setIsUpdatingTrip] = useState(true)
  const [isConfirmingAttendance, setIsConfirmingAttendance] = useState(false)

  const [showModal, setShowModal] = useState(MODAL.NONE)

  const [tripDetails, setTripDetails] = useState({} as TripData)
  const [destination, setDestination] = useState('')
  const [selectedDate, setSelectedDates] = useState({} as DatesSelected)
  const [option, setOption] = useState<'activity' | 'details'>('activity')
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")

  async function getTripDetails() {
    try {
      setIsLoadingTrip(true)

      if (!tripParams.id) {
        return router.back()
      }

      const trip = await tripServer.getById(tripParams.id)

      const maxLenghtDestination = 14

      const destination = trip.destination.length > maxLenghtDestination ?
        trip.destination.slice(0, maxLenghtDestination) + "..." : trip.destination

      const starts_at = dayjs(trip.starts_at).format("DD")
      const ends_at = dayjs(trip.ends_at).format("DD")
      const month = dayjs(trip.starts_at).format("MMM")

      setDestination(trip.destination)

      setTripDetails({
        ...trip,
        when: `${destination} de ${starts_at} a ${ends_at} de ${month}.`
      })
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoadingTrip(false)
    }
  }

  function handleSelectedDates(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDate.startsAt,
      endsAt: selectedDate.endsAt,
      selectedDay
    })

    setSelectedDates(dates)
  }

  async function handleUpdateTrip() {
    try {
      if(!tripParams.id) {
        return
      }

      if (tripParams.participant) {
        setShowModal(MODAL.CONFIRM_ATTENDANCE)
      }


      if(!destination || !selectedDate.startsAt || !selectedDate.endsAt) {
        return Alert.alert(
          "Atualizar viagem",
          "Check se você adicionou destino ou atualizou as datas."
        )
      }

      setIsUpdatingTrip(true)

      await tripServer.update({
        id: tripDetails.id,
        destination,
        starts_at: dayjs(selectedDate.startsAt.dateString).toString(),
        ends_at: dayjs(selectedDate.endsAt.dateString).toString(),
      })

      Alert.alert(
        "Atualizar viagem",
        "Viagem atualizada com successo!", [
          {
          text: 'Ok',
          onPress: () => {
            setShowModal(MODAL.NONE)
            getTripDetails()
          }
        }]
      )

    } catch (err) {
      console.log(err)
    } finally {
      setIsUpdatingTrip(false)
    }
  }

  async function handleConfirmAttendance() {
    try {
      if (!tripParams.id || !tripParams.participant) {
        return
      }

      if (!guestName.trim() || !guestEmail.trim()) {
        return Alert.alert(
          "Confirmação",
          "Preencha nome e e-mail para confirmar a viagem!"
        )
      }

      if (!validateInput.email(guestEmail.trim())) {
        return Alert.alert("Confirmação", "E-mail inválido!")
      }

      setIsConfirmingAttendance(true)

      await participantsServer.confirmTripByParticipantId({
        participantId: tripParams.participant,
        name: guestName,
        email: guestEmail.trim(),
      })

      Alert.alert("Confirmação", "Viagem confirmada com sucesso!")

      await tripStorage.save(tripParams.id)

      setShowModal(MODAL.NONE)
    } catch (error) {
      console.log(error)
      Alert.alert("Confirmação", "Não foi possível confirmar!")
    } finally {
      setIsConfirmingAttendance(false)
    }
  }


  useEffect(() => {
    getTripDetails()
  }, [])

  if (isLoadingTrip) {
    return <Loading />
  }


  return (
    <View className="flex-1 px-5 pt-16">
      <Input variant="tertiary">
        <MapPin color={colors.zinc[400]} size={20} />
        <Input.Field value={tripDetails.when} readOnly />

        <TouchableOpacity
          className="w-9 h-9 bg-zinc-800 items-center justify-center rounded"
          activeOpacity={0.6}
          onPress={() => setShowModal(MODAL.UPDATE_TRIP)}
        >
          <Settings2 color={colors.zinc[400]} size={20} />
        </TouchableOpacity>
      </Input>

      {
        option === 'activity' ? (<Activities tripDetails={tripDetails} />) : (<Details tripId={tripDetails.id} />)
      }

      <View className="w-full absolute -bottom-1 self-center justify-end pb-5 z-10 bg-zinc-950">
        <View className="w-full flex-row border border-zinc-800 bg-zinc-900 p-4 rounded-lg gap-2">
          <Button
            className="flex-1"
            onPress={() => setOption('activity')}
            variant={option === 'activity' ? 'primary' : 'secondary'}
          >
            <CalendarRange color={option === 'activity' ? colors.lime[950] : colors.zinc[200]} size={20} />
            <Button.Title>Atividades</Button.Title>
          </Button>

          <Button
            className="flex-1"
            onPress={() => setOption('details')}
            variant={option === 'details' ? 'primary' : 'secondary'}
          >
            <Info color={option === 'details' ? colors.lime[950] : colors.zinc[200]} size={20} />
            <Button.Title>Detalhes</Button.Title>
          </Button>
        </View>
      </View>

      <Modal
        title="Atualizar  viagem"
        subtitle="Somente quem criou a viagem pode editar."
        visible={showModal === MODAL.UPDATE_TRIP}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="gap-2 my-4">
          <Input variant="secondary">
            <MapPin color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Para onde?"
              onChangeText={setDestination}
              value={destination}
            />
          </Input>

          <Input variant="secondary">
            <CalendarIcon color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Quando?"
              value={selectedDate.formatDatesInText}
              onPressIn={() => setShowModal(MODAL.CALENDAR)}
              onFocus={() => Keyboard.dismiss()}
              showSoftInputOnFocus={false}
            />
          </Input>

          <Button onPress={handleUpdateTrip} isLoading={isUpdatingTrip} >
            <Button.Title>Atualizar</Button.Title>
          </Button>
        </View>

      </Modal>

      <Modal
        title="Selecionar datas"
        subtitle="Selecione a data de ida e volta da viagem"
        visible={showModal === MODAL.CALENDAR}
        onClose={() => { setShowModal(MODAL.UPDATE_TRIP) }}
      >
        <View className="gap-4 mt-4">
          <Calendar
            minDate={dayjs().toISOString()}
            onDayPress={handleSelectedDates}
            markedDates={selectedDate.dates}
          />

          <Button onPress={() => setShowModal(MODAL.UPDATE_TRIP)} >
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>

      <Modal
        title="Confirmar presença"
        visible={showModal === MODAL.CONFIRM_ATTENDANCE}
      >
        <View className="gap-4 mt-4">
          <Text className="text-zinc-400 font-regular leading-6 my-2">
            Você foi convidado (a) para participar de uma viagem para
            <Text className="font-semibold text-zinc-100">
              {" "}
              {tripDetails.destination}{" "}
            </Text>
            nas datas de{" "}
            <Text className="font-semibold text-zinc-100">
              {dayjs(tripDetails.starts_at).date()} a{" "}
              {dayjs(tripDetails.ends_at).date()} de{" "}
              {dayjs(tripDetails.ends_at).format("MMMM")}. {"\n\n"}
            </Text>
            Para confirmar sua presença na viagem, preencha os dados abaixo:
          </Text>

          <Input variant="secondary">
            <User color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Seu nome completo"
              onChangeText={setGuestName}
            />
          </Input>

          <Input variant="secondary">
            <Mail color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="E-mail de confirmação"
              onChangeText={setGuestEmail}
            />
          </Input>

          <Button
            isLoading={isConfirmingAttendance}
            onPress={handleConfirmAttendance}
          >
            <Button.Title>Confirmar minha presença</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  )
}