package org.example;

import java.util.List;

class RouteData {
    private List<FuelStation> fuelStations;
    private List<Restaurant> restaurants;

    public RouteData(List<FuelStation> fuelStations, List<Restaurant> restaurants) {
        this.fuelStations = fuelStations;
        this.restaurants = restaurants;
    }

    public List<FuelStation> getFuelStations() {
        return fuelStations;
    }

    public void setFuelStations(List<FuelStation> fuelStations) {
        this.fuelStations = fuelStations;
    }

    public List<Restaurant> getRestaurants() {
        return restaurants;
    }

    public void setRestaurants(List<Restaurant> restaurants) {
        this.restaurants = restaurants;
    }
}