import React, { useState, useEffect } from 'react';
import { View, StatusBar, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import styles from './Style';
import { BoldText, RegularText, LightText } from '../../components/StyledText';

import globalStyles from '../../constants/GlobalStyle';
import Colors from '../../constants/Colors';

import api from './../../services/Api';

export default function Main() {
    const [photo, setPhoto] = useState("");

    // useEffect(() => console.log("image: ", photo), [photo]);

    async function getFromGallery() {
        let { granted } = await ImagePicker.getCameraRollPermissionsAsync();
        let result;

        if (!granted) {
            resp = await ImagePicker.requestCameraRollPermissionsAsync();

            if (!resp.granted) {
                return alert("Permissão à galeria negada!");
            } 
        }
        
        result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 5],
        });

        if (!result.cancelled) {
            await setPhoto({ url: result.uri, type: result.type }); 
            // console.log(photo);   
            handleSubmitImage();              
        } else {
            alert("Processo cancelado!");
        }
    }

    async function getFromCamera() {
        let { granted } = await ImagePicker.getCameraPermissionsAsync();
        let result;

        if (!granted) {
            resp = await ImagePicker.requestCameraPermissionsAsync();

            if (!resp.granted) {
                return alert("Permissão à câmera negada!");
            }
        } 
        
        result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 5],
        });

        if (!result.cancelled) {
            await setPhoto({ url: result.uri, type: result.type });
            // console.log(photo);    
            handleSubmitImage();          
        } else {
            alert("Processo cancelado!");
        }
    }

    async function handleSubmitImage() {
        console.log("entrou com isso no state: ");
        console.log(photo);

        if (photo.url === null) {
            return alert("Sem nenhuma foto para a requisição!");
        }

        try {
            const data = new FormData();
            data.append('image', { 
                uri: photo.url, 
                name: 'first-photo.png', 
                filename :'firstImageName.png', 
                type: photo.type
            });
            data.append('Content-Type', photo.type);    
            console.log("data:", data);
    
            await api.post('/images/', data, { headers: { "Content-type": "multipart/form-data" }})
                .then((data) => {
                    console.log("Passou and data from api: ", data.data);
            
                    if (data.status === 201) {
                        alert("Imagem enviada com sucesso!");
                    } else {
                        alert("Erro no envio da imagem.");
                    }
                })
                .catch(err => {
                    console.log("Erro:", err);
                });
            
        } catch(err) {
            console.log("ERROOOOW:", err);
            alert("Ocorreu um erro");
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

