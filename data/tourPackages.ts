
import { TourPackage, tourData } from "./tourData";

// Re-export for backward compatibility (though we will update pages to import from tourData)
export { tourData as tourPackages };
export type { TourPackage };

export function getPackageById(id: string): TourPackage | undefined {
    return tourData.find((pkg) => pkg.id === id);
}
