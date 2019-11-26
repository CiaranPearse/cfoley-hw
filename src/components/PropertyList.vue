<template>
  <v-container>
    <v-layout
      v-if='loading'
      text-center
      wrap
      id='loading'
    >
      <v-row>
        <v-col
          text-center
        >
        <h3>Loading ...</h3>
        </v-col>
      </v-row>
    </v-layout>
    <v-layout
      v-if='error'
      text-center
      wrap
      id='error'
    >
      <v-alert type='error' name='error'>
        I'm an error alert. with loads of error text
      </v-alert>
    </v-layout>
    <v-layout
      v-if='!loading & !error'
      text-center
      wrap
      id='property-list'
    >
      <h3>{{properties.properties.length}} properties in {{properties.location.city.name}}, {{properties.location.city.country}}</h3>
      <v-row>
        <v-col
          v-for="property in cleanList"
          :key="property.id"
          :cols="4"
        >
          <v-card class='list-card'>
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
export default {
  name: 'PropertyList',
  data: () => ({
    loading: true,
    error: false,
    location: '',
    properties: []
  }),
  mounted () {
    // just a little timout here to show loading is working
    setTimeout(this.fetchData, 2000)
  },
  methods: {
    fetchData () {
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
    }
  },
  computed: {
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
