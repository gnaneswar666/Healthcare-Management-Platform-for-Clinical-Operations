package com.infosys.Medisphere.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KeycloakUserService {

    @Autowired
    private Keycloak keycloak;

    private final String REALM = "healthtwin";

    public void createPatientUser(
            String username,
            String password,
            String firstName,
            String lastName,
            String email,
            String patientId) {

        UserRepresentation user = new UserRepresentation();

        user.setEnabled(true);
        user.setUsername(username);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);

        Map<String, java.util.List<String>> attrs = new HashMap<>();
        attrs.put("patientId",
                Collections.singletonList(patientId));

        user.setAttributes(attrs);

        CredentialRepresentation credential =
                new CredentialRepresentation();

        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(false);

        user.setCredentials(
                Collections.singletonList(credential));

        UsersResource users =
                keycloak.realm(REALM).users();

        var response = users.create(user);

        System.out.println("Status = " + response.getStatus());

        if (response.getStatus() != 201) {
            throw new RuntimeException("Keycloak Error : " + response.getStatus());
        }

        String userId =
                response.getLocation().getPath()
                        .replaceAll(".*/([^/]+)$", "$1");

        RoleRepresentation role =
                keycloak.realm(REALM)
                        .roles()
                        .get("PATIENT")
                        .toRepresentation();

        users.get(userId)
                .roles()
                .realmLevel()
                .add(Collections.singletonList(role));
    }
}