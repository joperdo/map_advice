import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, ScrollView, Platform, StatusBar } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [location, setLocation] = useState(null);
  const [adviceData, setAdviceData] = useState([]);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Enable your device’s location.');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch('https://api.adviceslip.com/advice');
      const data = await response.json();

      if (data.slip) {
        setAdviceData(data.slip);
        setShowButton(false);
      } else {
        Alert.alert('Error', 'Unable to retrieve advice. Please try again later.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to retrieve advice. Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Location and Advice</Text>

      {location && (
        <View style={styles.locationContainer}>
          <Text style={styles.subtitle}>Check Your Location Here!</Text>
          <Text style={styles.locationText}>Latitude: {location.coords.latitude}</Text>
          <Text style={styles.locationText}>Longitude: {location.coords.longitude}</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here!"
            />
          </MapView>
        </View>
      )}

      {adviceData && (
        <View style={styles.adviceDataContainer}>
          <Text style={styles.movieText}>Your advice:</Text>
          <Text style={styles.movieText}>{adviceData.advice}</Text>
        </View>
      )}
      
      {showButton && (
        <View style={styles.buttonContainer}>
          <Button title="Get Advice" onPress={handleSearch} color="rgb(105, 0, 167)"/>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 30 : 30, // Adiciona espaço no topo
    backgroundColor: 'rgb(255, 195, 225)',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'rgb(105, 0, 167)',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 30,
    width: '100%',
  },
  adviceDataContainer: {
    padding: 20,
    backgroundColor: 'rgb(186, 112, 255)',
    borderRadius: 10,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  movieText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 5,
  },
  locationContainer: {
    padding: 20,
    backgroundColor: 'rgb(186, 112, 255)',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  locationText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
});

export default App;
