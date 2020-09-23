import React, { useState, useEffect, useMemo } from 'react';
import { View, StatusBar, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
// import * as Permissions from 'expo-permissions';
import Modal from 'react-native-modal';
import Communications from 'react-native-communications';

import styles from './Style';
import { BoldText, RegularText, LightText } from '../../components/StyledText';

import globalStyles from '../../constants/GlobalStyle';
import Colors from '../../constants/Colors';

import api from './../../services/Api';

export default function Main() {
    const [photo, setPhoto] = useState(null);

    const [allProducts, setAllProducts] = useState([]);
    const [productSelected, setProductSelected] = useState(null);

    const [qtnLinksDesired, setQtnLinksDesired] = useState(5);
    const [links, setLinks] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLinksModalVisible, setIsLinksModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isObjectSearchLoading, setIsObjectSearchLoading] = useState(false);

    useEffect(() => {
        if (photo) {
            Alert.alert(
                "Foto tirada com sucesso!",
                "O que deseja fazer agora?",
                [
                    { 
                        text: 'Procurar o(s) objeto(s)',
                        onPress: () => handleSubmitInitialImage(),
                        style: 'default',
                    },
                    {
                        text: "Cancelar",
                        onPress: () => console.log("Cancelado"),
                        style: 'cancel,'
                    }
                ],
                { cancelable: false }
            )
        }
    }, [photo]);

    async function getFromGallery() {
        setIsLoading(true);

        let { granted } = await ImagePicker.getCameraRollPermissionsAsync();
        let result;

        if (!granted) {
            const resp = await ImagePicker.requestCameraRollPermissionsAsync();

            if (!resp.granted) {
                return alert("Permissão à galeria negada!");
            } 
        }
        
        result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 5],
        });

        if (!result.cancelled) {
            setPhoto(result.uri);
        } else {
            alert("Processo cancelado!");
            setIsLoading(false);
        }
    }

    async function getFromCamera() {
        setIsLoading(true);

        let { granted } = await ImagePicker.getCameraPermissionsAsync();
        let result;

        if (!granted) {
            const resp = await ImagePicker.requestCameraPermissionsAsync();

            if (!resp.granted) {
                return alert("Permissão à câmera negada!");
            }
        } 
        
        result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 5],
        });

        if (!result.cancelled) {
            setPhoto(result.uri);            
        } else {
            alert("Processo cancelado!");
            setIsLoading(false);
        }
    }

    async function handleSubmitInitialImage() {
        console.log("entrou com isso no state: ");
        console.log(photo);

        if (photo === null) {
            return alert("Sem nenhuma foto para a requisição!");
        }

        try {
            const data = new FormData();
            const imageName = `first-photo-${Date.now()}.png`;
            console.log(`https://simple-search-api.herokuapp.com/images/${imageName}`);

            data.append('image', { 
                uri: photo, 
                name: imageName, 
                filename : `file-${imageName}`, 
            });
    
            await api.post('/initial-image', data, { headers: { "Content-type": "multipart/form-data" }})
                .then((response) => {
                    // console.log("Passou and data from api: ", response.data);
                    setAllProducts(response.data.allObjects);    
                    
                    setIsLoading(false);
                    toggleModal();
                })
                .catch(err => {
                    console.log("Erro:", err);
                    setIsLoading(false);
                });            
        } catch(err) {
            console.log("ERROOOOW:", err);
            alert("Ocorreu um erro");
            setIsLoading(false);
        }        
    }

    function handleSelectProduct(name) {
        console.log("selecionou: ", name);
        if (productSelected === name) {
            setProductSelected(null);
        } else {
            setProductSelected(name);
        }
    }

    async function handleSubmitSelectedProduct() {
        setIsObjectSearchLoading(true);

        if (productSelected === null) {
            setIsObjectSearchLoading(false);
            return alert("Sem nenhum produto para a requisição!");
        }

        const data = {
            choosenObject: productSelected,
            allObjects: allProducts,
            qntLinks: qtnLinksDesired,
        }

        try {
            await api.post('/object-image', data)
            .then((response) => {
                // console.log("Passou and data from api: ", response.data);                
                setLinks(response.data.resultsSearch);
                toggleModal();
                setTimeout(() => setIsLinksModalVisible(true), 1500);
                setIsObjectSearchLoading(false);
            })
            .catch(err => {
                console.log("Erro:", err);
            });            
        } catch(err) {
            console.log("ERROOOOW:", err);
            alert("Ocorreu um erro");
            setIsObjectSearchLoading(false);
        }           
    }

    function toggleModal() {
        setIsModalVisible(!isModalVisible);

        if (!isModalVisible) {
            setProductSelected(null);
        }
    }

    const qntLinks = useMemo(() => links.length, [links]);

  return (
    <>
        <StatusBar barStyle="dark-content" />

        <Modal
            isVisible={isLinksModalVisible}
            style={styles.modal}
            onBackButtonPress={() => setIsLinksModalVisible(false)}
            onBackdropPress={() => setIsLinksModalVisible(false)}
        >
            <View style={{ flex: 1 }}>
                <View style={styles.boxTitleModal}>
                    <BoldText style={[styles.titleModal, { fontSize: 17 }]}>
                        {qntLinks} link(s) para encontrar um(a) {productSelected}
                    </BoldText>
                </View>

                {
                    isObjectSearchLoading ?
                        <ActivityIndicator size="large" color={Colors.pcTransp} />
                    :
                        <>
                        <View style={styles.boxContentModal}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ 
                                    paddingVertical: 10, 
                                    paddingHorizontal: 20,
                                    alignItems: 'center',
                                }}
                            >
                                {
                                    links !== "Sem resultado para a busca" ?
                                    links.map(link => (
                                        <TouchableOpacity
                                            key={link[0]}
                                            onPress={() => Communications.web(link[1])}
                                            style={{
                                                marginVertical: 15,
                                            }}                         
                                        >
                                            <RegularText
                                                style={{
                                                    color: 'steelblue',
                                                    textDecorationLine: 'underline',
                                                    textAlign: 'center',                                           
                                                }}
                                            >
                                                {link[1]}
                                            </RegularText>
                                        </TouchableOpacity>
                                    ))
                                    :
                                    <BoldText>Sem resultado para a busca.</BoldText>
                                }
                                
                            </ScrollView>
                        </View>
                        </>
                }
                
                <View style={styles.boxFooterModal}>
                    <TouchableOpacity 
                        style={styles.btnCloseModal}
                        onPress={() => setIsLinksModalVisible(false)}
                    >
                        <BoldText style={{ color: 'tomato' }}>X</BoldText>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

        <Modal
            isVisible={isModalVisible}
            style={styles.modal}
            onBackButtonPress={() => setIsModalVisible(false)}
            onBackdropPress={() => setIsModalVisible(false)}
        >
            <View style={{ flex: 1 }}>
                <View style={styles.boxTitleModal}>
                    <BoldText style={styles.titleModal}>Escolha o objeto desejado</BoldText>

                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <RegularText style={{ fontSize: 12, marginTop: 15 }}>
                            Quantos links de resultado você deseja?
                        </RegularText>
                        
                        <View style={styles.boxQntLinksModal}>
                            <TouchableOpacity 
                                style={styles.btnSetQntLinks}
                                onPress={() => {
                                    if (qtnLinksDesired > 1) {
                                        setQtnLinksDesired(old => old - 1)
                                    }
                                }}
                            >
                                <BoldText style={{ color: Colors.pcTransp }}>-</BoldText>
                            </TouchableOpacity>

                            <LightText>{qtnLinksDesired}</LightText>

                            <TouchableOpacity 
                                style={styles.btnSetQntLinks}
                                onPress={() => setQtnLinksDesired(old => old + 1)}
                            >
                                <BoldText style={{ color: Colors.pcTransp }}>+</BoldText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {
                    isLoading ?
                        <ActivityIndicator size="large" color={Colors.pc} />
                    :
                        <>
                        <View style={styles.boxContentModal}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 10 }}
                            >
                                {
                                    allProducts &&
                                    allProducts.map(product => (
                                        <TouchableOpacity
                                            key={product[0] + Math.random()}
                                            onPress={() => handleSelectProduct(product[0])}
                                            style={{ 
                                                borderWidth: productSelected === product[0] ? 5 : 0,
                                                borderColor: productSelected === product[0] ? Colors.pcTransp : 'transparent',
                                                marginHorizontal: 10,
                                                borderRadius: 15, 
                                            }}
                                        >
                                            <Image source={{ uri: `data:image/png;base64,${product[1]}` }} style={[styles.imageModal, { resizeMode: 'contain' }]} />
                                        </TouchableOpacity>
                                    ))
                                }
                                
                            </ScrollView>
                        </View>
                        </>
                }

                
                <View style={styles.boxFooterModal}>
                    <TouchableOpacity 
                        disabled={productSelected ? false : true} 
                        style={[styles.btnSearch, { opacity: productSelected ? 1 : 0.3 }]}
                        onPress={handleSubmitSelectedProduct}
                    >
                        <BoldText style={{ opacity: productSelected ? 1 : 0.3 }}>P E S Q U I S A R</BoldText>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.btnCloseModal}
                        onPress={toggleModal}
                    >
                        <BoldText style={{ color: 'tomato' }}>X</BoldText>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        
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
                    {
                        isLoading ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size="large" color={Colors.pc} />
                            </View>
                        :
                            <>
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
                            </>
                    }                    
                </View>
            </View>

            <View style={styles.containerFooter}>
                <LightText style={styles.txtFooter}>Lucas Leal © Copyright 2020</LightText>
            </View>
        </View>
    </>
  );
}

