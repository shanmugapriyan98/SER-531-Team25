package org.example;
import com.google.maps.model.DirectionsStep;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.google.maps.DirectionsApi;
import com.google.maps.GeoApiContext;
import com.google.maps.model.DirectionsResult;
import com.google.maps.model.LatLng;
import org.apache.jena.query.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class RouteController {

    private final GeoApiContext context;

    public RouteController() {
        this.context = new GeoApiContext.Builder()
                .apiKey("YOUR_GOOGLE_API_KEY")
                .build();
    }

    @GetMapping("/route")
    public RouteData getRouteData(@RequestParam String source, @RequestParam String destination) {
        try {
            DirectionsResult result = DirectionsApi.getDirections(context, source, destination).await();
            List<FuelStation> fuelStations = new ArrayList<>();
            List<Restaurant> restaurants = new ArrayList<>();

            for (DirectionsStep step : result.routes[0].legs[0].steps) {
                LatLng location = step.startLocation;
                fuelStations.addAll(getFuelStations(location));
                restaurants.addAll(getRestaurants(location));
            }

            return new RouteData(fuelStations, restaurants);
        } catch (Exception e) {
            e.printStackTrace();
            return new RouteData(new ArrayList<>(), new ArrayList<>());
        }
    }

    private List<FuelStation> getFuelStations(LatLng location) {
        List<FuelStation> stations = new ArrayList<>();
        String queryString = "SELECT ?name ?location WHERE { ?station <hasLocation> <" + location + "> . }";
        Query query = QueryFactory.create(queryString);
        try (QueryExecution qexec = QueryExecutionFactory.sparqlService("http://sparql-endpoint", query)) {
            ResultSet results = qexec.execSelect();
            while (results.hasNext()) {
                QuerySolution solution = results.nextSolution();
                FuelStation station = new FuelStation();
                station.setName(solution.getLiteral("name").getString());
                station.setLocation(solution.getLiteral("location").getString());
                stations.add(station);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return stations;
    }

    private List<Restaurant> getRestaurants(LatLng location) {
        List<Restaurant> restaurants = new ArrayList<>();
        String queryString = "SELECT ?name ?location WHERE { ?restaurant <hasLocation> <" + location + "> . }";
        Query query = QueryFactory.create(queryString);
        try (QueryExecution qexec = QueryExecutionFactory.sparqlService("http://sparql-endpoint", query)) {
            ResultSet results = qexec.execSelect();
            while (results.hasNext()) {
                QuerySolution solution = results.nextSolution();
                Restaurant restaurant = new Restaurant();
                restaurant.setName(solution.getLiteral("name").getString());
                restaurant.setLocation(solution.getLiteral("location").getString());
                restaurants.add(restaurant);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return restaurants;
    }
}
