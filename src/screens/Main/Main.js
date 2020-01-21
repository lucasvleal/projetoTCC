import React, { useState, useEffect } from 'react';
import { View, StatusBar, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import styles from './Style';
import globalStyles from '../../constants/GlobalStyle';
import { BoldText, RegularText, LightText } from '../../components/StyledText';
import Colors from '../../constants/Colors';

export default function Main() {
    const [photo, setPhoto] = useState(null);

    useEffect(() => console.log(photo), [photo]);

    async function getFromGallery() {
        let resp = await ImagePicker.getCameraRollPermissionsAsync();
        let result, ok = false;

        if (!resp.granted) {
            resp = await ImagePicker.requestCameraRollPermissionsAsync();

            if (!resp.granted) {
                return alert("Permissão à galeria negada!");
            } else {
                ok = true;
            }
        } else {
            ok = true;
        }
        
        if (ok) {
            result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 5],
            });

            if (!result.cancelled) {
                setPhoto({ url: result.uri, type: result.type }); 
                // console.log(photo);                 
            } else {
                alert("Processo cancelado!");
            }
        }
    }

    async function getFromCamera() {
        let resp = await ImagePicker.getCameraPermissionsAsync();
        let result, ok = false;

        if (!resp.granted) {
            resp = await ImagePicker.requestCameraPermissionsAsync();

            if (!resp.granted) {
                return alert("Permissão à câmera negada!");
            } else {
                ok = true;
            }
        } else {
            ok = true;
        }
        
        if (ok) {
            result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 5],
            });

            if (!result.cancelled) {
                setPhoto({ url: result.uri, type: result.type });
                // console.log(photo);              
            } else {
                alert("Processo cancelado!");
            }
        }
    }

  return (
    <>
        <StatusBar barStyle="dark-content" />
        
        <View style={globalStyles.container}>
            <View style={styles.containerHeader}>
                <BoldText style={styles.txtHeader}>SimpleSearch</BoldText>
            </View>

            <View style={styles.containerBody}>
                <View style={styles.boxBody}>
                    <RegularText style={styles.txtBody}>
                        Bem vindo! Para começar a busca é simples, primeiro escolha uma das opções abaixo:
                    </RegularText>
                </View>

                <View style={styles.boxButtons}>
                    <View style={styles.boxBtn}>
                        <View style={styles.btnText}>
                            <LightText style={styles.text}>
                                Tire uma foto diretamente da câmera do seu smartphone
                            </LightText>
                        </View>

                        <View style={styles.btns}>
                            <TouchableOpacity style={styles.btn} onPress={getFromCamera}>
                                <MaterialIcons name="camera-alt" size={30} color={Colors.ac} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.boxBtn}>
                        <View style={styles.btnText}>
                            <LightText style={styles.text}>
                                Escolha uma foto da galeria do seu smartphone
                            </LightText>
                        </View>

                        <View style={styles.btns}>
                            <TouchableOpacity style={styles.btn} onPress={getFromGallery}>
                                <MaterialIcons name="photo-library" size={30} color={Colors.ac} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.containerFooter}>
                <LightText style={styles.txtFooter}>Lucas Leal © Copyright 2020</LightText>
            </View>
        </View>
    </>
  );
}

