package com.infosys.consestService.Modal;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ConsetService")
public class ConsestService {

	@Id
	private String id;
	private String patientId;
	private String consentType;
	private String status;
	private Instant grantedDate;
	private Instant expiryDate;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getPatientId() {
		return patientId;
	}
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
	public String getConsentType() {
		return consentType;
	}
	public void setConsentType(String consentType) {
		this.consentType = consentType;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Instant getGrantedDate() {
		return grantedDate;
	}
	public void setGrantedDate(Instant grantedDate) {
		this.grantedDate = grantedDate;
	}
	public Instant getExpiryDate() {
		return expiryDate;
	}
	public void setExpiryDate(Instant expiryDate) {
		this.expiryDate = expiryDate;
	}
	@Override
	public String toString() {
		return "ConsestService [id=" + id + ", patientId=" + patientId + ", consentType=" + consentType + ", status="
				+ status + ", grantedDate=" + grantedDate + ", expiryDate=" + expiryDate + "]";
	}
	
}
