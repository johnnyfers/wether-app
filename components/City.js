import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import { RectButton, RectButtonProps } from 'react-native-gesture-handler'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { GEO_API_KEY } from 'react-native-dotenv'
import { useDispatch, useSelector } from 'react-redux';
import { citiesActions } from '../store/cities-sclice'

import { colors } from '../utils/index'
import { styles } from './styles'

const BASE_WEATHER_URL = 'https://api.opencagedata.com/geocode/v1/json?'

export default function City() {
    const dispatch = useDispatch()
    const { cities } = useSelector((state) => state.city)

    const [errorMessage, setErrorMEssage] = useState()
    const [data, setData] = useState()
    const [cityName, setCityName] = useState()

    function cityNameInputHandler(value) {
        setCityName(value)
    }

    async function fetchDataByCityName() {
        const cityUrl = `${BASE_WEATHER_URL}q=${cityName}&key=${GEO_API_KEY}`

        const response = await fetch(cityUrl)
        const result = await response.json()


        if (result.status.message == 'OK') {
            setData({
                city: cityName,
                code: result.results[0].components.state_code,
                country: result.results[0].components.country
            })

            dispatch(citiesActions.addCityToArray({ data }))
        }
    }

    async function fetchDataByLatLong() {
        let { status } = await Location.requestForegroundPermissionsAsync()

        if (status !== 'granted') {
            setErrorMessage('Access to location is needed to run the app')
            return
        }

        const location = await Location.getCurrentPositionAsync()
        const { latitude, longitude } = location.coords

        const cityUrl = `${BASE_WEATHER_URL}q=${latitude}+${longitude}&key=${GEO_API_KEY}`

        const response = await fetch(cityUrl)
        const result = await response.json()

        if (result.status.message == 'OK') {
            setData({
                city: result.results[0].components.city,
                code: result.results[0].components.state_code,
                country: result.results[0].components.country
            })

            dispatch(citiesActions.addCityToArray({ data }))
        }
    }

    const CityItem = (city, code, country) => {
        return (
            <View style={styles.card}>
                <View style={styles.insideCard}>
                    <View>
                        <Text style={styles.textMain}>
                            {city}
                        </Text>
                        <Text>
                            {code}, {country}
                        </Text>
                    </View>

                    <Ionicons name="ios-arrow-forward" size={34} color={colors.PRIMARY_COLOR} />
                </View>
            </View>)
    }

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.title}>
                    <Text style={styles.titleText}>Search</Text>
                </View>

                <Text style={styles.subtitle}>Type your location here: </Text>

                <TextInput
                    style={styles.input}
                    onChangeText={cityNameInputHandler}
                />

                <View style={styles.buttons}>
                    <RectButton
                        activeOpacity={0.7}
                        style={styles.button}
                        onPress={fetchDataByCityName}
                    >
                        <Text style={styles.buttonText}>Submit</Text>
                    </RectButton>
                    <RectButton
                        activeOpacity={0.7}
                        style={styles.button}
                        onPress={fetchDataByLatLong}
                    >
                        <MaterialCommunityIcons name="target" size={34} color="white" />
                    </RectButton>
                </View>

                <Text style={styles.searches}>Previous Searches</Text>

                {cities.length > 0 && cities.map((city) => {
                    
                })}

            </View>
        </View>
    )
}
