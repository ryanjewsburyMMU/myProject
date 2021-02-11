import React, { Component, useEffect, useState } from 'react';

import { Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions, TouchableOpacity, Object, Alert } from 'react-native';

import StarRating from 'react-native-star-rating';

import Icon from 'react-native-vector-icons/FontAwesome';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';


export default class CreateReviewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current_id: "",
            current_name: "",
            overallRating: 0,
            priceRating: 0,
            qualityRating: 0,
            clenlinessRating: 0,
            reviewBody: ""

        }
    }

    componentDidMount() {
        const route = this.props.route
        const { id, name } = route.params;
        this.setState({ current_id: id })
        this.setState({ current_name: name })
    }

    onStarPress_OverallRating(rating) {
        this.setState({
            overallRating: rating
        });
    }
    onStarPress_Price(rating) {
        this.setState({
            priceRating: rating
        });
    }
    onStarPress_Quality(rating) {
        this.setState({
            qualityRating: rating
        });
    }
    onStarPress_Clenliness(rating) {
        this.setState({
            clenlinessRating: rating
        });
    }

    test(){
        console.log(this.state.priceRating)
        console.log(this.state.qualityRating)
        console.log(this.state.priceRating)
        console.log(this.state.overallRating)

        console.log(this.state.reviewBody)
    }


    async post_review () {
		const navigation = this.props.navigation;

		console.log("Post Request Made For Login")
		return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + this.state.current_id + "/review",
			{
				method: 'post',
                headers: {'Content-Type': 'application/json', 'X-Authorization' : await AsyncStorage.getItem('@session_token')},
				body: JSON.stringify({
					overall_rating: this.state.overallRating,
					price_rating: this.state.priceRating,
                    quality_rating: this.state.qualityRating,
                    clenliness_rating: this.state.clenlinessRating,
                    review_body: this.state.reviewBody

				})
			})
			.then((response)=> {
				if (parseInt(response.status) == 201)
				{
					Alert.alert("Thank You!", "Thanks for your review! We've added this to our systems now.")			
				}
				if (parseInt(response.status) == 400)
				{
					Alert.alert("An Error Occured!", "Please Check your input and try again. ")			
                }
                if (parseInt(response.status) == 401)
				{
                    Alert.alert("Are You Logged In?", "An error occured, this usually means your not logged in.")				
                }
                if (parseInt(response.status) == 404)
				{
                    Alert.alert("An Error Occured", "Please try again soon.")				
                }
                if (parseInt(response.status) == 500)
				{
                    Alert.alert("Server Error", "Please check your internet connection, if this problem persists please contact our team")				
                }
			})
			.catch((error) => {
				console.log(error);
			})
	}

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.mainTitle}>Write a Review For {this.state.current_name}</Text>
                </View>
                <View style={styles.footer}>
                    <ScrollView>
                    <Text style={styles.title}>How Would You Rate Your Overall Experience?</Text>
                    <StarRating
                        disabled={false}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        halfStar={'star-half'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        starSize={30}
                        rating={this.state.overallRating}
                        selectedStar={(rating) => this.onStarPress_OverallRating(rating)}
                        fullStarColor={'#eaca97'}
                    />
                    <Text style={styles.title}>How Would You Rate The Price?</Text>
                    <StarRating
                        disabled={false}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        halfStar={'star-half'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        starSize={30}
                        rating={this.state.priceRating}
                        selectedStar={(rating) => this.onStarPress_Price(rating)}
                        fullStarColor={'#eaca97'}
                    />
                     <Text style={styles.title}>How Would You Rate The Quality?</Text>
                    <StarRating
                        disabled={false}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        halfStar={'star-half'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        starSize={30}
                        rating={this.state.qualityRating}
                        selectedStar={(rating) => this.onStarPress_Quality(rating)}
                        fullStarColor={'#eaca97'}
                    />
                     <Text style={styles.title}>How Would You Rate The Clenliness?</Text>
                    <StarRating
                        disabled={false}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        halfStar={'star-half'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        starSize={30}
                        rating={this.state.clenlinessRating}
                        selectedStar={(rating) => this.onStarPress_Clenliness(rating)}
                        fullStarColor={'#eaca97'}
                    />
                    <Text style={{marginTop: 30}}>Please Leave a Comment: </Text>
                    <TextInput placeholder="Provide More Details About Your Visit" multiline={true} onChangeText={(text) => {this.setState({reviewBody: text})}}
                    numberOfLines={4}>
                    </TextInput>

                    <TouchableOpacity style={styles.loginButton} onPress={()=>{this.post_review()}}>
                        <Text style={styles.text}>Submit Review</Text>
                    </TouchableOpacity>
                    </ScrollView>

                   

                </View>
            </View>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaca97',
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 50
    },
    title: {
        display: 'flex',
        color: '#eaca97',
        fontSize: 18,
        fontWeight: "bold",
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    mainTitle: {
        display: 'flex',
        color: '#fff',
        fontSize: 25,
        fontWeight: "bold",
        textAlign: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 15,
        marginBottom: 10
    },
    locationTitle: {
        display: 'flex',
        color: '#eaca97',
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    },
    loginButton: {
		alignItems: "center",
		width: "100%",
		height:40,
		backgroundColor: "#eaca97",
		padding: 10,
		marginTop: 20,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	},
    favourite: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    reviewButton: {
        alignItems: "center",
        width: "100%",
        backgroundColor: '#eaca97',
        height: 40,
        padding: 10,
        marginTop: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },

})