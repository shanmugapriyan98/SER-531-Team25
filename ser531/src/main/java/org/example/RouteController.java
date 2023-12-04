package org.example;
import com.google.maps.model.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.google.maps.DirectionsApi;
import com.google.maps.GeoApiContext;
import org.apache.jena.query.*;
import java.util.List;

import java.util.ArrayList;

@RestController
public class RouteController {
    private static final double MAX_SEGMENT_DISTANCE_MILES = 200.0;
    private final GeoApiContext context;

    public RouteController() {
        this.context = new GeoApiContext.Builder()
                .apiKey("AIzaSyC3nfH5oqck92--QACrsXCRav7Ta2mOsUs")
                .build();
    }

    @GetMapping("/route")
    public RouteData getRouteData(@RequestParam String source, @RequestParam String destination) {
        try {
            DirectionsResult result = DirectionsApi.getDirections(context, source, destination).await();
            List<FuelStation> fuelStations = new ArrayList<>();
            List<Restaurant> restaurants = new ArrayList<>();
            if (result.routes != null && result.routes.length > 0) {
                for (DirectionsRoute route : result.routes) {
                    for (DirectionsLeg leg : route.legs) {
                        List<DirectionsStep> currentSegmentSteps = new ArrayList<>();
                        double currentSegmentDistance = 0;
                        for (DirectionsStep step : leg.steps) {
                            double stepDistance = step.distance.inMeters / 1609.34; // Convert meters to miles
                            if (currentSegmentDistance + stepDistance <= MAX_SEGMENT_DISTANCE_MILES) {
                                // Add step to the current segment
                                currentSegmentSteps.add(step);
                                currentSegmentDistance += stepDistance;
                            } else {
                                // Process the current segment
                                fuelStations.addAll(processSegment(currentSegmentSteps, currentSegmentDistance));
                                // Start a new segment with the current step
                                currentSegmentSteps = new ArrayList<>();
                                currentSegmentSteps.add(step);
                                currentSegmentDistance = stepDistance;
                            }
                        }
                        // Process the last segment
                        fuelStations.addAll(processSegment(currentSegmentSteps, currentSegmentDistance));
                    }
                }
            } else {
                System.out.println("No routes found.");
            }
            return new RouteData(fuelStations, restaurants);
        } catch (Exception e) {
            e.printStackTrace();
            return new RouteData(new ArrayList<>(), new ArrayList<>());
        }
    }

    private static List<FuelStation> processSegment(List<DirectionsStep> steps, double distance) {
        List<FuelStation> allStations = new ArrayList<>();

        while (distance > MAX_SEGMENT_DISTANCE_MILES) {
            // Extract a subsegment with MAX_SEGMENT_DISTANCE_MILES distance
            List<DirectionsStep> subSegment = new ArrayList<>();
            double subSegmentDistance = 0;

            for (DirectionsStep step : steps) {
                double stepDistance = step.distance.inMeters / 1609.34;

                if (subSegmentDistance + stepDistance <= MAX_SEGMENT_DISTANCE_MILES || stepDistance >= MAX_SEGMENT_DISTANCE_MILES || subSegmentDistance >= MAX_SEGMENT_DISTANCE_MILES) {
                    subSegment.add(step);
                    subSegmentDistance += stepDistance;
                } else {
                    // Process the subsegment
                    allStations.addAll(getFuelStations(subSegment.get(0).startLocation, subSegment.get(subSegment.size() - 1).endLocation));

                    // Start a new subsegment with the current step
                    subSegment = new ArrayList<>();
                    subSegment.add(step);
                    subSegmentDistance = stepDistance;
                }
            }

            // Process the last subsegment
            allStations.addAll(getFuelStations(subSegment.get(0).startLocation, subSegment.get(subSegment.size() - 1).endLocation));

            // Update the remaining distance
            distance -= subSegmentDistance;
        }

        // Process the remaining segment
        allStations.addAll(getFuelStations(steps.get(0).startLocation, steps.get(steps.size() - 1).endLocation));

        return allStations;
    }


    private static List<FuelStation> getFuelStations(LatLng startLocation, LatLng endLocation) {
        // Implement your SPARQL query for gas stations near the given location
        // Print or process the results accordingly
        System.out.println("Querying gas stations near: " + startLocation);
        double lat1 = Math.min(startLocation.lat, endLocation.lat);
        double lat2 = Math.max(startLocation.lat, endLocation.lat);
        double lng1 = Math.min(startLocation.lng, endLocation.lng);
        double lng2 = Math.max(startLocation.lng, endLocation.lng);
        List<FuelStation> stations = new ArrayList<>();
        String queryStr = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                "PREFIX ex: <http://www.semanticweb.org/poppin220ug/ontologies/2023/10/untitled-ontology-3#>\n" +
                "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
                "\n" +
                "SELECT ?name ?latitude ?longitude\n" +
                "WHERE {\n" +
                "    ?gasStation rdf:type ex:Station .\n" +
                "    ?gasStation ex:stationName ?name .\n" +
                "    ?gasStation ex:latitude ?latitudeString .\n" +
                "    ?gasStation ex:longitutde ?longitudeString .\n" +
                "    BIND(xsd:float(?latitudeString) AS ?latitude)\n" +
                "    BIND(xsd:float(?longitudeString) AS ?longitude)\n" +
                "    FILTER (\n" +
                "        (?latitude >= " + lat1 + " && ?latitude <= " + lat2 + ")\n" +
                "        &&\n" +
                "        (?longitude >= " + lng1 + " && ?longitude <= " + lng2 + ")\n" +
                "    )\n" +
                "}";


        Query query = QueryFactory.create(queryStr);
        try (QueryExecution qexec = QueryExecutionFactory.sparqlService("http://localhost:3030/test-data", query)) {
            ResultSet results = qexec.execSelect();
            List<QuerySolution> solutions = ResultSetFormatter.toList(results);
            for (QuerySolution solution : solutions) {
                String name = solution.getLiteral("name").getString();
                System.out.println(name);
                FuelStation station = new FuelStation();
                station.setName(name);
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
