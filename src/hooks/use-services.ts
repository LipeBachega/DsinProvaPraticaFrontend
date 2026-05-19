import { useEffect, useState } from "react";
import { getServicesRequest } from "../api/service";
import { ApiRequestError } from "../api/shared";
import type { IService } from "../types/service.type";

export function useServices() {
  const [services, setServices] = useState<IService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadServices() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getServicesRequest();
        setServices(response.data ?? []);
      } catch (error) {
        if (error instanceof ApiRequestError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Não foi possível carregar os serviços.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadServices();
  }, []);

  return {
    services,
    isLoading,
    errorMessage,
  };
}
