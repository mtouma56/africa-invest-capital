#!/bin/bash

# Liste des fichiers à corriger
FILES=(
  "src/pages/client/Dashboard.jsx"
  "src/pages/admin/Loans.jsx"
  "src/pages/admin/Dashboard.jsx"
  "src/pages/admin/ClientDetails.jsx"
  "src/pages/client/LoanDetails.jsx"
  "src/pages/admin/LoanDetails.jsx"
)

# Suffixe facultatif pour les sauvegardes de sed (par défaut : .bak).
# Pour ne pas créer de sauvegarde, définir BACKUP_SUFFIX="" avant d'exécuter le script.
BACKUP_SUFFIX=${BACKUP_SUFFIX-.bak}

# Fonction portable pour sed -i sur macOS et Linux
sedi() {
  if [ "$(uname)" = "Darwin" ]; then
    sed -i "${BACKUP_SUFFIX}" "$@"
  else
    sed -i"${BACKUP_SUFFIX}" "$@"
  fi
}

# Correction des statusLabels
for file in "${FILES[@]}"; do
  echo "Correction de $file..."
  # Remplacer les définitions de statusLabels
  sedi 's/{ text: '"'"'En attente'"'"', bg: '"'"'bg-yellow-100'"'"', text: '"'"'text-yellow-800'"'"' }/{ label: '"'"'En attente'"'"', bg: '"'"'bg-yellow-100'"'"', textColor: '"'"'text-yellow-800'"'"' }/g' "$file"
  sedi 's/{ text: '"'"'En cours'"'"', bg: '"'"'bg-blue-100'"'"', text: '"'"'text-blue-800'"'"' }/{ label: '"'"'En cours'"'"', bg: '"'"'bg-blue-100'"'"', textColor: '"'"'text-blue-800'"'"' }/g' "$file"
  sedi 's/{ text: '"'"'Approuvé'"'"', bg: '"'"'bg-green-100'"'"', text: '"'"'text-green-800'"'"' }/{ label: '"'"'Approuvé'"'"', bg: '"'"'bg-green-100'"'"', textColor: '"'"'text-green-800'"'"' }/g' "$file"
  sedi 's/{ text: '"'"'Rejeté'"'"', bg: '"'"'bg-red-100'"'"', text: '"'"'text-red-800'"'"' }/{ label: '"'"'Rejeté'"'"', bg: '"'"'bg-red-100'"'"', textColor: '"'"'text-red-800'"'"' }/g' "$file"

  # Remplacer les usages de text par label
  sedi 's/statusLabels\[loan.status\].text}/statusLabels[loan.status].label}/g' "$file"
  sedi 's/${statusLabels\[loan.status\].text}/${statusLabels[loan.status].label}/g' "$file"
  sedi 's/{statusLabels\[loan.status\].text}/{statusLabels[loan.status].label}/g' "$file"
  
  # Remplacer les références à text dans les classes par textColor
  sedi 's/${statusLabels\[loan.status\].bg} ${statusLabels\[loan.status\].text}/${statusLabels[loan.status].bg} ${statusLabels[loan.status].textColor}/g' "$file"
  sedi 's/{statusLabels\[loan.status\].bg} {statusLabels\[loan.status\].text}/{statusLabels[loan.status].bg} {statusLabels[loan.status].textColor}/g' "$file"
done

echo "Correction terminée!"
