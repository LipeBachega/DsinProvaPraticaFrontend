import { useEffect, useState } from "react";
import { getServicesRequest } from "../api/service";
import { ApiRequestError } from "../api/shared";
import type { IService } from "../types/service.type";

export function useServices() {
  // Responsável por carregar o catálogo público de serviços da home.
  const [services, setServices] = useState<IService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await getServicesRequest();
        setServices(response.data ?? []);
      } catch (error) {
        if (error instanceof ApiRequestError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Nao foi possivel carregar os servicos.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    // Como os serviços não dependem de outro filtro, basta carregar uma vez ao montar.
    loadServices();
  }, []);

  return {
    services,
    isLoading,
    errorMessage,
  };
}
