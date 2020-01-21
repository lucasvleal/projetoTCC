import { StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';

const styles = StyleSheet.create({ 
    containerHeader: {
        flex: 0.1,

        borderBottomColor: Colors.scTransp,
        borderBottomWidth: 1.5,
        marginHorizontal: 10,

        justifyContent: "center",
        alignItems: "center",
    },

        txtHeader: {
            color: Colors.pc,
            fontSize: 25,
        },

    containerBody: {
        flex: 0.8,
    },

        boxBody: {
            flex: 0.3,

            justifyContent: "center",
            alignItems: "center",
        },
        
            txtBody: {
                color: Colors.pc,
                fontSize: 18.5,
                textAlign: "center",
            },

        boxButtons: {
            flex: 0.7,
        },

            boxBtn: {
                flex: 1,
                flexDirection: "row",
            },

                btnText: {
                    flex: 0.7,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 10
                },

                    text: {
                        color: Colors.pcTransp,
                        fontSize: 15,
                        textAlign: "right"
                    },

                btns: {
                    flex: 0.3,
                    justifyContent: "center",
                    alignItems: "center",
                },

                    btn: {
                        height: 84,
                        width: 84,
                        borderRadius: 42,

                        justifyContent: "center",
                        alignItems: "center",
                        
                        backgroundColor: Colors.sc,

                        shadowColor: Colors.pcTransp,
                        shadowOpacity: 0.5,
                        shadowRadius: 2.5,
                        shadowOffset: {
                            height: 2,
                            width: 0.5
                        },
                        elevation: 4,
                    },

    containerFooter: {
        flex: 0.1,

        justifyContent: "center",
        alignItems: "center",
    },

        txtFooter: {
            color: Colors.pcTransp,
            fontSize: 12,
        },
    
  });
  
export default styles;