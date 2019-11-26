<template>
  <v-container>
    <v-layout
      v-if='loading'
      text-center
      wrap
    >
      <v-row>
        <v-col
          text-center
        >
        <flower-spinner
          class="text-center"
          :animation-duration="2500"
          :size="70"
          color="#ff1d5e"
        />
        </v-col>
      </v-row>
    </v-layout>
    <v-layout
      v-if='error'
      text-center
      wrap
    >
      <v-alert type="error">
        I'm an error alert. with loads of error text
      </v-alert>
    </v-layout>
    <v-layout
      v-if='!loading & !error'
      text-center
      wrap
      id='propertyList'
    >
      <h3>{{properties.properties.length}} properties in {{properties.location.city.name}}, {{properties.location.city.country}}</h3>
      <v-row>
        <v-col
          v-for="property in cleanList"
          :key="property.id"
          :cols="4"
        >
          <v-card>
            <v-img
              :src='"//"+property.image'
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
            >
            <div v-if="property.isFeatured">
              <v-chip
                class="ma-2"
                color="orange"
                text-color="white"
              >
                Featured
                <v-icon right>mdi-star</v-icon>
              </v-chip>
             </div>
            </v-img>
            <v-card-text>
              <div class="my-4 subtitle-1 black--text">
                {{property.name}}
              </div>
            </v-card-text>
            <v-card-text>
              <div class="text-left">
                <span class="font-weight-light">{{property.overview}}</span>
              </div>
            </v-card-text>
            <v-card-text>
              <div class="text-left">
                <span class="font-weight-regular">Rating:</span> <span class="font-weight-bold">{{property.rating}}</span>
              </div>
            </v-card-text>
            <v-card-text>
              <div class="text-left">
                <span class="font-weight-regular">Lowest Price:</span> <span class="font-weight-bold">&euro; {{property.lowPrice}}</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import { FlowerSpinner } from 'epic-spinners'
export default {
  name: 'HelloWorld',
  components: {
    FlowerSpinner
  },
  data: () => ({
    loading: true,
    error: false,
    location: '',
    properties: null
  }),
  mounted () {
    axios
      .get('https://gist.githubusercontent.com/ruimendesM/bf8d095f2e92da94938810b8a8187c21/raw/70b112f88e803bf0f101f2c823a186f3d076d9e6/properties.json')
      .then(response => (
        this.properties = response.data
      ))
      .catch(error => {
        console.log(error)
        this.error = true
      })
      .finally(this.loading = false)
  },
  computed: {
    // **** Note **** below will return full list of all data ordered without checking existance, calculating
    // orderedProperties: function () {
    //   return _.orderBy(this.properties.properties, 'isFeatured', ['desc'])
    // },
    // **** Note **** Decided to sanitize here rather than do calculations in Mustaches.
    // reacct wanted to use for/in rather than the old style loop but
    // cleanedProperties: function () {
    //   let allProperties = []
    //   let propertyList = this.properties.properties
    //   let price
    //   for (var i = 0; i < propertyList.length; i++) {
    //     let singleProperty = []
    //     singleProperty.id = propertyList[i].id
    //     singleProperty.name = propertyList[i].name
    //     singleProperty.isFeatured = propertyList[i].isFeatured
    //     if (propertyList[i].images) {
    //       singleProperty.image = '//' + propertyList[i].images[0].prefix + propertyList[i].images[0].suffix
    //     } else {
    //       singleProperty.image = 'https://via.placeholder.com/370x200.png?text=No+Image+Currently'
    //     }
    //     if (propertyList[i].overallRating) {
    //       singleProperty.rating = propertyList[i].overallRating.overall
    //     } else {
    //       singleProperty.rating = 'Not yet rated'
    //     }
    //     singleProperty.overview = propertyList[i].overview
    //     price = parseInt(propertyList[i].lowestPricePerNight.value) / 7.55
    //     singleProperty.lowPrice = Math.round(price * 100) / 100
    //     allProperties.push(singleProperty)
    //   }
    //   return _.orderBy(allProperties, 'isFeatured', ['desc'])
    // },
    cleanList: function () {
      // Only want to pass what I actually want to use
      let mappedProperties = _.map(this.properties.properties, i => _.pick(i, 'name', 'id', 'isFeatured', 'images', 'overallRating', 'overview', 'lowestPricePerNight'))
      // Just a little bit of sanitizing here - better here than adding a bunch of conditions to the view.
      for (var i = 0; i < mappedProperties.length; i++) {
        if (mappedProperties[i].images) {
          mappedProperties[i].image = '//' + mappedProperties[i].images[0].prefix + mappedProperties[i].images[0].suffix
        } else {
          mappedProperties[i].image = 'https://via.placeholder.com/370x200.png?text=No+Image+Currently'
        }
        if (mappedProperties[i].overallRating) {
          mappedProperties[i].rating = mappedProperties[i].overallRating.overall / 10
        } else {
          mappedProperties[i].rating = 'Not yet rated'
        }
        let calcPrice = parseInt(mappedProperties[i].lowestPricePerNight.value) / 7.55
        mappedProperties[i].lowPrice = Math.round(calcPrice * 100) / 100
        delete mappedProperties[i].lowestPricePerNight
        delete mappedProperties[i].overallRating
        delete mappedProperties[i].images
      }
      return mappedProperties
    }
  }
}
</script>

<style scoped>

</style>
