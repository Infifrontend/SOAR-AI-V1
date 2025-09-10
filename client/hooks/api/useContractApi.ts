const API_BASE_URL = import.meta.env?.VITE_API_URL || "/api";
import axios from "axios";

export interface ContractData {
  vendor: string;
  vendorEmail: string;
  client: string;
  value: string;
  startDate: string;
  endDate: string;
  terms: string;
  slaRequirements: string;
  paymentTerms: string;
  autoRenewal: boolean;
  performanceBonus: boolean;
  exclusivity: boolean;
  customClauses: string;
  contractType: string;
}

const baseApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useContractApi = () => {
  const createContract = async (contractData: any) => {
    try {
      console.log("Sending contract creation request:", contractData);

      // Map frontend contract data to backend expected format
      const backendData = {
        company_name: contractData.company_name || contractData.vendor,
        company_email:
          contractData.company_email || contractData.vendorEmail || "",
        title:
          contractData.title ||
          `${contractData.contract_type || "Contract"} - ${
            contractData.company_name || contractData.vendor
          }`,
        contract_type: contractData.contract_type || "corporate_travel",
        client_department:
          contractData.client_department || contractData.client,
        value: parseFloat(contractData.value) || 0,
        start_date: contractData.start_date || contractData.startDate,
        end_date: contractData.end_date || contractData.endDate,
        terms: contractData.terms || "",
        sla_requirements:
          contractData.sla_requirements || contractData.slaRequirements || "",
        payment_terms_days: contractData.payment_terms_days || 30,
        auto_renewal:
          contractData.auto_renewal || contractData.autoRenewal || false,
        performance_bonus:
          contractData.performance_bonus ||
          contractData.performanceBonus ||
          false,
        exclusivity: contractData.exclusivity || false,
        custom_clauses:
          contractData.custom_clauses || contractData.customClauses || "",
      };

      console.log(
        "Mapped contract data for backend:",
        baseApi,
        "ssss",
        backendData
      );

      const response = await baseApi.post("/contracts/", backendData);
      console.log("Contract creation response:", response);
      return { success: true, data: response };
    } catch (error) {
      console.error("Error creating contract:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to create contract",
      };
    }
  };

  const getContracts = async (filters = {}) => {
    try {
      console.log("Fetching contracts from API...");

      // Add timeout to prevent hanging requests
      const response = await baseApi.get("/contracts/", {
        timeout: 10000, // 10 second timeout
      });

      console.log("Raw API response status:", response.status);
      console.log("Response data type:", typeof response);
      console.log("Response data is array:", Array.isArray(response.data));
      console.log("Raw response data:", response);

      // Check if the response indicates server issues
      if (!response) {
        console.error("Empty response from server");
        return {
          success: false,
          error:
            "Server returned empty response. Please check if the Django server is running.",
          data: [],
        };
      }

      // Handle the response data and map it to frontend format
      let contractsData = [];

      if (Array.isArray(response.data)) {
        contractsData = response.data.map((contract) => {
          // Map backend contract data to frontend expected format
          return {
            id: contract.contract_number || contract.id || `CTR-${Date.now()}`,
            vendor:
              contract.company_name || contract.vendor || "Unknown Vendor",
            client:
              contract.client_department || contract.client || "Unknown Client",
            type: contract.contract_type || contract.type || "Unknown Type",
            value: contract.value || 0,
            status: contract.status || "Draft",
            startDate:
              contract.start_date ||
              contract.startDate ||
              new Date().toISOString().split("T")[0],
            endDate:
              contract.end_date ||
              contract.endDate ||
              new Date().toISOString().split("T")[0],
            signedDate: contract.signed_date || contract.signedDate || null,
            progress: contract.progress || 0,
            nextAction: contract.next_action || "Review Required",
            documents: contract.documents || 0,
            breachRisk: contract.breach_risk || "Low",
            breachCount: contract.breach_count || 0,
            parties: [
              contract.company_name || contract.vendor || "Unknown Vendor",
            ],
            attachedOffer: null, // Will be populated if needed
            lastActivity:
              contract.last_activity ||
              contract.updated_at ||
              new Date().toISOString().split("T")[0],
            performanceScore: contract.performance_score || 85,
            slaCompliance: contract.sla_compliance || 90,
            customerSatisfaction: contract.customer_satisfaction || 4.0,
            costEfficiency: contract.cost_efficiency || 85,
            breachHistory: contract.breach_history || [],
            marketPosition: contract.market_position || "Competitive",
            alternativeVendors: contract.alternative_vendors || [],
            financialHealth: contract.financial_health || "Good",
            technicalCapability: contract.technical_capability || "Good",
            relationshipScore: contract.relationship_score || 4.0,
            terms:
              contract.terms ||
              "Standard corporate travel agreement terms and conditions",
            description:
              contract.title || `Contract with ${contract.vendor || "vendor"}`,
            milestones: contract.milestones || [
              {
                name: "Contract Creation",
                date:
                  contract.start_date || new Date().toISOString().split("T")[0],
                status: "completed",
              },
              {
                name: "Review Process",
                date:
                  contract.start_date || new Date().toISOString().split("T")[0],
                status: "pending",
              },
            ],
            comments: contract.comments || [],
            attachments: contract.attachments || [],
          };
        });

        console.log(
          "✓ Contracts mapped successfully:",
          contractsData.length,
          "contracts"
        );
        console.log("First mapped contract sample:", contractsData[0]);
      } else if (
        response.data &&
        response.data.results &&
        Array.isArray(response.data.results)
      ) {
        // Handle paginated response
        contractsData = response.data.results.map((contract) => {
          return {
            id: contract.contract_number || contract.id || `CTR-${Date.now()}`,
            vendor:
              contract.company_name || contract.vendor || "Unknown Vendor",
            client:
              contract.client_department || contract.client || "Unknown Client",
            type: contract.contract_type || contract.type || "Unknown Type",
            value: contract.value || 0,
            status: contract.status || "Draft",
            startDate:
              contract.start_date ||
              contract.startDate ||
              new Date().toISOString().split("T")[0],
            endDate:
              contract.end_date ||
              contract.endDate ||
              new Date().toISOString().split("T")[0],
            signedDate: contract.signed_date || contract.signedDate || null,
            progress: contract.progress || 0,
            nextAction: contract.next_action || "Review Required",
            documents: contract.documents || 0,
            breachRisk: contract.breach_risk || "Low",
            breachCount: contract.breach_count || 0,
            parties: [
              "SOAR-AI Airlines",
              contract.company_name || contract.vendor || "Unknown Vendor",
            ],
            attachedOffer: null,
            lastActivity:
              contract.last_activity ||
              contract.updated_at ||
              new Date().toISOString().split("T")[0],
            performanceScore: contract.performance_score || 85,
            slaCompliance: contract.sla_compliance || 90,
            customerSatisfaction: contract.customer_satisfaction || 4.0,
            costEfficiency: contract.cost_efficiency || 85,
            breachHistory: contract.breach_history || [],
            marketPosition: contract.market_position || "Competitive",
            alternativeVendors: contract.alternative_vendors || [],
            financialHealth: contract.financial_health || "Good",
            technicalCapability: contract.technical_capability || "Good",
            relationshipScore: contract.relationship_score || 4.0,
            terms:
              contract.terms ||
              "Standard corporate travel agreement terms and conditions",
            description:
              contract.title ||
              `Contract with ${contract.company_name || "vendor"}`,
            milestones: contract.milestones || [
              {
                name: "Contract Creation",
                date:
                  contract.start_date || new Date().toISOString().split("T")[0],
                status: "completed",
              },
              {
                name: "Review Process",
                date:
                  contract.start_date || new Date().toISOString().split("T")[0],
                status: "pending",
              },
            ],
            comments: contract.comments || [],
            attachments: contract.attachments || [],
          };
        });
        console.log(
          "✓ Paginated contracts mapped successfully:",
          contractsData.length,
          "contracts"
        );
      } else {
        console.warn(
          "Expected array or paginated response but got:",
          typeof response.data,
          response.data
        );
        contractsData = [];
      }

      return { success: true, data: contractsData };
    } catch (error) {
      console.error("Error fetching contracts:", error);

      // Handle different types of errors
      if (error.code === "ECONNABORTED") {
        console.error("Request timeout");
        return {
          success: false,
          error: "Request timeout. Please try again.",
          data: [],
        };
      }

      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);

        if (error.response.status === 500) {
          return {
            success: false,
            error:
              "Server error. Please check if the Django server is running properly.",
            data: [],
          };
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        return {
          success: false,
          error:
            "No response from server. Please check your connection and if the server is running.",
          data: [],
        };
      }

      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          "Failed to fetch contracts",
        data: [],
      };
    }
  };

  const updateContract = async (contractId: string, contractData: any) => {
    try {
      console.log("Updating contract with ID:", contractId);
      console.log("Contract data:", contractData);

      const response = await baseApi.put(
        `/contracts/${contractId}/`,
        contractData
      );

      console.log("Update response:", response);
      return { success: true, data: response };
    } catch (error) {
      console.error("Error updating contract:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          "Failed to update contract",
      };
    }
  };

  const deleteContract = async (contractId: string) => {
    try {
      await baseApi.delete(`/contracts/${contractId}/`);
      return { success: true };
    } catch (error) {
      console.error("Error deleting contract:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Failed to delete contract",
      };
    }
  };

  const uploadDocument = async (contractId: string, file: File) => {
    try {
      console.log(`Uploading document for contract ${contractId}:`, file.name);

      // Validate file type on frontend
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
        "application/rtf",
      ];

      const allowedExtensions = [
        ".pdf",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
        ".txt",
        ".rtf",
      ];
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));

      if (
        !allowedTypes.includes(file.type) &&
        !allowedExtensions.includes(fileExtension)
      ) {
        return {
          success: false,
          error:
            "Invalid file type. Please upload only document files (PDF, DOC, DOCX, XLS, XLSX, TXT, RTF).",
        };
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return {
          success: false,
          error: "File size too large. Please upload files smaller than 10MB.",
        };
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("document", file);

      const response = await baseApi.post(
        `/contracts/${contractId}/upload_document/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Document upload response:", response);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error uploading document:", error);
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          "Failed to upload document",
      };
    }
  };

  const getContractDocuments = async (contractId: string) => {
    try {
      console.log(`Getting documents for contract ${contractId}`);

      const response = await baseApi.get(
        `/contracts/${contractId}/get_documents/`
      );
      console.log("Get documents response:", response);
      if (response) {
        return {
          success: true,
          data: response.data.documents,
        };
      } else {
        return {
          success: false,
          error: response.error || "Failed to get documents",
        };
      }
    } catch (error) {
      console.error("Error getting contract documents:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Failed to get documents",
      };
    }
  };

  const viewDocument = async (
    contractId: string,
    documentId: string,
    fileName: string
  ) => {
    try {
      console.log(`Viewing document ${documentId} for contract ${contractId}`);

      const response = await baseApi.get(
        `/contracts/${contractId}/download_document/?document_id=${documentId}`,
        {
          responseType: "blob",
        }
      );

      // Create blob URL for viewing
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      // Open in new tab for viewing
      window.open(url, "_blank");

      // Clean up the URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

      return { success: true };
    } catch (error) {
      console.error("Error viewing document:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Failed to view document",
      };
    }
  };

  const downloadDocument = async (documentId: string, contractId?: string) => {
    try {
      console.log(`Getting document ${documentId} for viewing/download`);

      let targetContractId = contractId;

      // If no contractId provided, try to find it
      if (!targetContractId) {
        console.log("No contract ID provided, searching for document...");

        // Get all contracts and find the one that contains this document
        const contractsResponse = await baseApi.get("/contracts/");
        let foundContract = null;
        let documentInfo = null;

        // Handle the response data properly
        let contractsData = [];
        if (Array.isArray(contractsResponse.data)) {
          contractsData = contractsResponse.data;
        } else if (
          contractsResponse.data &&
          Array.isArray(contractsResponse.data)
        ) {
          contractsData = contractsResponse.data;
        } else if (
          contractsResponse.data &&
          contractsResponse.data.results &&
          Array.isArray(contractsResponse.data.results)
        ) {
          contractsData = contractsResponse.data.results;
        }

        // Find which contract contains this document by checking each contract's documents
        for (const contract of contractsData) {
          try {
            const contractNumber = contract.contract_number || contract.id;
            console.log(`Checking documents for contract ${contractNumber}`);

            // Try to get documents for this contract
            const documentsResponse = await baseApi.get(
              `/contracts/${contractNumber}/get_documents/`
            );

            let documents = [];
            if (
              documentsResponse.success &&
              Array.isArray(documentsResponse.documents)
            ) {
              documents = documentsResponse.documents;
            } else if (Array.isArray(documentsResponse.data)) {
              documents = documentsResponse.data;
            } else if (
              documentsResponse.data &&
              Array.isArray(documentsResponse.data.documents)
            ) {
              documents = documentsResponse.data.documents;
            }

            const foundDocument = documents.find(
              (doc) => doc.document_id === documentId
            );
            if (foundDocument) {
              targetContractId = contractNumber;
              foundContract = contract;
              documentInfo = foundDocument;
              console.log(
                `Found document ${documentId} in contract ${targetContractId}`
              );
              break;
            }
          } catch (e) {
            // Skip this contract if we can't get its documents
            console.warn(
              `Could not check documents for contract ${
                contract.contract_number || contract.id
              }:`,
              e
            );
            continue;
          }
        }

        if (!targetContractId) {
          console.error("Contract not found for document:", documentId);
          throw new Error(
            `Document with ID ${documentId} not found in any contract`
          );
        }
      }

      console.log(
        `Using contract ${targetContractId} for document ${documentId}`
      );

      // Make the download request with proper error handling using the api method directly
      const response = await baseApi.get(
        `/contracts/${targetContractId}/download_document/?document_id=${documentId}`,
        {
          responseType: "blob",
          timeout: 30000, // 30 second timeout for large files
        }
      );

      const blob = response.data;

      if (!(blob instanceof Blob)) {
        throw new Error("Downloaded data is not a file blob.");
      }

      if (blob.size === 0) {
        throw new Error(
          "Downloaded file is empty. The document may be corrupted or not properly stored."
        );
      }

      // Check if it's an error disguised as a blob
      if (blob.type === "application/json") {
        const text = await blob.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.error || "Server returned an error");
      }

      // Create blob URL for download/view
      const url = window.URL.createObjectURL(blob);
      return url;
    } catch (error) {
      console.error("Error downloading document:", error);
      // Provide more detailed error information
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        console.error("Response data:", error.response.data);

        if (error.response.status === 404) {
          throw new Error(`Document not found on server (${documentId})`);
        } else if (error.response.status === 403) {
          throw new Error(`Access denied to document (${documentId})`);
        } else if (error.response.status >= 500) {
          throw new Error(
            `Server error while fetching document (${documentId})`
          );
        }

        // For other HTTP errors
        const statusText = error.response.statusText || "Unknown error";
        throw new Error(
          `Server returned status ${error.response.status}: ${statusText}`
        );
      }

      // For network errors or other issues
      if (error.code === "NETWORK_ERROR") {
        throw new Error(
          "Network error - please check your connection and try again"
        );
      }

      if (error.name === "TimeoutError") {
        throw new Error(
          "Request timed out - the file may be too large or the server is slow"
        );
      }

      // Re-throw with more context
      throw new Error(
        `Failed to download document: ${error.message || "Unknown error"}`
      );
    }
  };

  const addComment = async (
    contractId: string,
    comment: string,
    author: string = "Current User"
  ) => {
    try {
      console.log(`Adding comment to contract ${contractId}:`, comment);

      const response = await baseApi.post(
        `/contracts/${contractId}/add_comment/`,
        {
          comment: comment,
          author: author,
        }
      );

      console.log("Add comment response:", response);
      return { success: true, data: response };
    } catch (error) {
      console.error("Error adding comment:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Failed to add comment",
      };
    }
  };

  const getClosedWonOpportunities = async () => {
    try {
      console.log("Fetching closed won opportunities for vendor names...");

      const response = await baseApi.get(
        "/opportunities/closed-won-opportunities/",
        {
          timeout: 5000, // Reduced timeout for faster response
        }
      );

      console.log("Closed won opportunities response:", response);

      // Handle the response from new endpoint
      if (response && response.success && Array.isArray(response.data)) {
        console.log(
          "✓ Closed won vendor names loaded:",
          response.data.length,
          "vendors"
        );
        return {
          success: true,
          data: response.data,
          error: response.error || null,
        };
      }

      // Fallback if no data
      const fallbackVendors = [
        "TechCorp Solutions",
        "Global Industries",
        "Elite Business Travel",
        "Corporate Journey Ltd",
        "Premier Voyage Group",
        "Business Travel Partners",
        "Executive Travel Services",
        "Global Travel Solutions",
      ];

      console.warn("No closed won opportunities found, using fallback");
      return {
        success: true,
        data: fallbackVendors,
        error: "No closed won opportunities found, using default vendor list",
      };
    } catch (error) {
      console.error("Error fetching closed won opportunities:", error);

      // Provide fallback vendor list on any error
      const fallbackVendors = [
        "TechCorp Solutions",
        "Global Industries",
        "Elite Business Travel",
        "Corporate Journey Ltd",
        "Premier Voyage Group",
        "Business Travel Partners",
        "Executive Travel Services",
        "Global Travel Solutions",
      ];

      // Improve error handling for timeout
      if (error.code === "ECONNABORTED") {
        return {
          success: true, // Return success with fallback data
          data: fallbackVendors,
          error:
            "Request timed out while fetching closed won opportunities. Using default vendor list.",
        };
      }

      if (error.response?.status === 404) {
        return {
          success: true,
          data: fallbackVendors,
          error:
            "Closed won opportunities endpoint not found. Using default vendor list.",
        };
      }

      return {
        success: true, // Return success with fallback data instead of failure
        data: fallbackVendors,
        error: `API error: ${
          error.response?.data?.error || error.message || "Unknown error"
        }. Using default vendor list.`,
      };
    }
  };

  return {
    createContract,
    getContracts,
    updateContract,
    deleteContract,
    uploadDocument,
    getContractDocuments,
    viewDocument,
    downloadDocument,
    addComment,
    getClosedWonOpportunities,
  };
};
