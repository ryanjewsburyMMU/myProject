import React, { Component, useEffect, useState } from 'react';

import { Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions, TouchableOpacity, Image, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import StarRating from 'react-native-star-rating';


import AsyncStorage from '@react-native-async-storage/async-storage';

import style from '../../../Styles/stylesheet'


export default class EditReview extends Component {
	constructor(props) {
		super(props)
		this.state = {
			photo: [],
			review_id: "",
			location_id: "",
			clenliness_rating: "",
			price_rating: "",
			overall_rating: "",
			quality_rating: "",
			review_body: "",

			new_clenliness_rating: "",
			new_price_rating: "",
			new_overall_rating: "",
			new_quality_rating: "",
			new_review_body: ""
		}

	}

	componentDidMount() {
		const route = this.props.route
		const { review_id, location_id, clenliness_rating, price_rating, overall_rating, quality_rating, review_body } = route.params;
		this.setState({
		review_id: review_id,
		location_id: location_id,
		clenliness_rating: clenliness_rating,
		price_rating: price_rating,
		overall_rating: overall_rating,
		quality_rating: quality_rating,
		review_body: review_body,
		// Updated Variables
		new_clenliness_rating: clenliness_rating,
		new_price_rating: price_rating,
		new_overall_rating: overall_rating,
		new_quality_rating: quality_rating,
		new_review_body: review_body},()=>{
			console.log("Information here: "+ this.state.review_id, this.state.location_id)
			this.displayPhoto()
		})
	}

	async displayPhoto() {
		const navigation = this.props.navigation
		console.log("Searching the database for your search queires")
		return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + this.state.location_id + "/review/" + this.state.review_id + "/photo",
			{
				method: 'get',
				headers: { 'Content-Type': 'image/jpeg', 'X-Authorization': await AsyncStorage.getItem('@session_token') },
			})

			.then((response) => {
				if (parseInt(response.status) == 200) {
					console.log("success?")
					return response
				}
				if (parseInt(response.status) == 404) {
				}
				if (parseInt(response.status) == 500) {
				}
			})
			.then((responseJson) => {
				console.log("RESPONSE JSON IS AS FOLLOWS BBAY")
				console.log(responseJson)
				this.setState({ photo: responseJson })
			})
			.catch((error) => {
				console.log(error);
			})
	}

	async deletePhoto() {
		const navigation = this.props.navigation
		console.log("Searching the database for your search queires")
		return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + this.state.location_id + "/review/" + this.state.review_id + "/photo",
			{
				method: 'delete',
				headers: { 'Content-Type': 'image/jpeg', 'X-Authorization': await AsyncStorage.getItem('@session_token') },
			})

			.then((response) => {
				if (parseInt(response.status) == 200) {
					Alert.alert("success, photo deleted")
					this.displayPhoto()
				}
				if (parseInt(response.status) == 404) {
				}
				if (parseInt(response.status) == 500) {
				}
				else{
					console.log("Undefined error code: "+ response.status)
				}
			})
			.catch((error) => {
				console.log(error);
			})
	}



	onStarPress_OverallRating(rating) {
		this.setState({
			new_overall_rating: rating
		});
	}
	onStarPress_Price(rating) {
		this.setState({
			new_price_rating: rating
		});
	}
	onStarPress_Quality(rating) {
		this.setState({
			new_quality_rating: rating
		});
	}
	onStarPress_Clenliness(rating) {
		this.setState({
			new_clenliness_rating: rating
		});
	}



	async patch_review() {
		console.log("Patch Request Made to Updated User Information")
		let to_send = {};

		if (this.state.clenliness_rating != this.state.new_clenliness_rating) {
			to_send['clenliness_rating'] = this.state.new_clenliness_rating
		}
		if (this.state.price_rating != this.state.new_price_rating) {
			to_send['price_rating'] = this.state.new_price_rating
		}
		if (this.state.overall_rating != this.state.new_overall_rating) {
			to_send['overall_rating'] = this.state.new_overall_rating
		}
		if (this.state.quality_rating != this.state.new_quality_rating) {
			to_send['quality_rating'] = this.state.new_quality_rating
		}
		if (this.state.review_body != this.state.new_review_body) {
			to_send['review_body'] = this.state.new_review_body
		}

		return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + this.state.location_id + "/review/" + this.state.review_id,
			{
				method: 'patch',
				headers: { 'Content-Type': 'application/json', 'X-Authorization': await AsyncStorage.getItem('@session_token') },
				body: JSON.stringify(to_send)
			})
			.then((response) => {
				// Add error catching here
				if (response.status == "200") {
					Alert.alert("Item has been updated")
					this.props.navigation.goBack()
				}
				if (response.status == "400") {
					Alert.alert("Bad Request 400")
				}
				if (response.status == "401") {
					Alert.alert("Unauthorised (401)")
				}
				if (response.status == "403") {
					Alert.alert("You cannot edit this review")
				}
				if (response.status == "404") {
					Alert.alert("Review update not found, please try again(404)")
				}
				if (response.status == "500") {
					Alert.alert("There was an erroe connecting, try again (500)")
				}
			})
			.catch((error) => {
				console.log(error)
			})

	}


	loadImage() {
		// If image is null
		if (this.state.photo == undefined) {
			return (
				<View>
					<Text style={style.textCenterBlack}>You did not submit a photo with this review.</Text>
				</View>
			)
		} else {
			console.log(this.state.photo)
			return (
				<View>
					<Image
						style={{ width: 100, height: 90, marginTop: 20 }}
						source={{
							uri:this.state.photo.url
						}}
					/>
					<TouchableOpacity onPress={()=>{this.deletePhoto()}}>
						<Text>Delete Photo?</Text>
					</TouchableOpacity>
				</View>
			)
		}
	}




	render() {
		const navigation = this.props.navigation;
		return (
			<View style={style.mainContainer}>
				<View style={style.mainHeader}>
					<Text style={style.mainTitle}>Edit Review</Text>
				</View>
				<View style={style.mainFooter}>
					<ScrollView>
						<TouchableOpacity style={style.mainButton} onPress={() => { navigation.goBack() }}>
							<Text style={style.textCenterWhite}>Go Back</Text>
						</TouchableOpacity>
						<Text style={style.subTitle}>How Would You Rate Your Overall Experience?</Text>
						<StarRating
							disabled={false}
							emptyStar={'star-o'}
							fullStar={'star'}
							halfStar={'star-half'}
							iconSet={'FontAwesome'}
							maxStars={5}
							starSize={30}
							rating={parseInt(this.state.new_overall_rating)}
							selectedStar={(rating) => this.onStarPress_OverallRating(rating)}
							fullStarColor={'#eaca97'}
						/>
						<Text style={style.subTitle}>How Would You Rate The Price?</Text>
						<StarRating
							disabled={false}
							emptyStar={'star-o'}
							fullStar={'star'}
							halfStar={'star-half'}
							iconSet={'FontAwesome'}
							maxStars={5}
							starSize={30}
							rating={parseInt(this.state.new_price_rating)}
							selectedStar={(rating) => this.onStarPress_Price(rating)}
							fullStarColor={'#eaca97'}
						/>
						<Text style={style.subTitle}>How Would You Rate The Quality?</Text>
						<StarRating
							disabled={false}
							emptyStar={'star-o'}
							fullStar={'star'}
							halfStar={'star-half'}
							iconSet={'FontAwesome'}
							maxStars={5}
							starSize={30}
							rating={parseInt(this.state.new_quality_rating)}
							selectedStar={(rating) => this.onStarPress_Quality(rating)}
							fullStarColor={'#eaca97'}
						/>
						<Text style={style.subTitle}>How Would You Rate The Clenliness?</Text>
						<StarRating
							disabled={false}
							emptyStar={'star-o'}
							fullStar={'star'}
							halfStar={'star-half'}
							iconSet={'FontAwesome'}
							maxStars={5}
							starSize={30}
							rating={parseInt(this.state.new_clenliness_rating)}
							selectedStar={(rating) => this.onStarPress_Clenliness(rating)}
							fullStarColor={'#eaca97'}
						/>
						<View style={style.gap}>
							<Text style={style.textCenterBlack}>Update Your Comment: </Text>
							<TextInput style={style.inputBody} placeholder={this.state.review_body} multiline={true} onChangeText={(text) => { this.setState({ new_review_body: text }) }}
								numberOfLines={4} value={this.state.new_review_body}>
							</TextInput>
						</View>

						{this.loadImage()}

						<TouchableOpacity style={style.mainButton} onPress={() => { this.patch_review() }}>
							<Text style={style.textCenterWhite}>Submit Review</Text>
						</TouchableOpacity>




					</ScrollView>


				</View>
			</View>
		)
	}
}

