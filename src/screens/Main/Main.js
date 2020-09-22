import React, { useState, useEffect } from 'react';
import { View, StatusBar, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
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
    const [links, setLinks] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLinksModalVisible, setIsLinksModalVisible] = useState(false);

    useEffect(() => {
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
    }, [photo]);

    async function getFromGallery() {
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
        }
    }

    async function getFromCamera() {
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
                // type: photo.type
            });
            // data.append('Content-Type', photo.type);    
            // console.log("data:", data);
    
            await api.post('/initial-image', data, { headers: { "Content-type": "multipart/form-data" }})
                .then((response) => {
                    console.log("Passou and data from api: ", response);
                    setAllProducts(response.data.allObjects);          
                    
                    toggleModal();                    
                })
                .catch(err => {
                    console.log("Erro:", err);
                });
            
        } catch(err) {
            console.log("ERROOOOW:", err);
            alert("Ocorreu um erro");
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
        // console.log("entrou com isso no state: ");
        // console.log(photo);

        if (productSelected === null) {
            return alert("Sem nenhum produto para a requisição!");
        }

        const data = {
            choosenObject: productSelected,
            allObjects: allProducts,
        }

        try {
            await api.post('/object-image', data)
            .then((response) => {
                // if (response.status !== 201) {
                //     alert("Erro no envio da imagem.");
                //     return;
                // }

                console.log("Passou and data from api: ", response.data);                
                setLinks(response.data.resultsSearch);
                toggleModal();
                setTimeout(() => setIsLinksModalVisible(true), 1500);
            })
            .catch(err => {
                console.log("Erro:", err);
            });            
        } catch(err) {
            console.log("ERROOOOW:", err);
            alert("Ocorreu um erro");
        }   
        
        // toggleModal();
    }

    function toggleModal() {
        setIsModalVisible(!isModalVisible);

        if (!isModalVisible) {
            setProductSelected(null);
        }
    }
    

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
                        Links para encontrar um(a) {productSelected}
                    </BoldText>
                </View>

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
                </View>

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

                <View style={styles.boxFooterModal}>
                    <TouchableOpacity 
                        disabled={productSelected ? false : true} 
                        style={[styles.btnSearch, { opacity: productSelected ? 1 : 0.3 }]}
                        onPress={handleSubmitSelectedProduct}
                    >
                        <BoldText style={{ opacity: productSelected ? 1 : 0.3 }}>Pesquisar</BoldText>
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

