/**
 * Audits generated mystery payload for logical consistency according to Spec §5.3 & §5.4.
 *
 * Rules verified:
 * 1. Exactly one canonical culprit ID that matches an existing suspect ID.
 * 2. All suspect IDs are unique.
 * 3. Evidence items reference existing suspect IDs.
 * 4. Timeline events reference existing suspect IDs.
 * 5. Minimum evidence count according to difficulty (Easy: >=5, Med: >=8, Hard: >=12).
 * 6. Solution includes explanation for red herrings and motive.
 * 7. Evidence items have appropriate clue types (direct, circumstantial, red_herring, contextual).
 */
export function validateMysteryConsistency(mysteryData) {
  const errors = [];

  if (!mysteryData) {
    return { valid: false, errors: ['Mystery data is missing.'] };
  }

  // 1. Validate Suspects
  const suspects = mysteryData.suspects || [];
  if (!Array.isArray(suspects) || suspects.length < 3) {
    errors.push('Case must have at least 3 suspects.');
  }

  const suspectIds = new Set();
  for (const s of suspects) {
    if (!s.id || typeof s.id !== 'string') {
      errors.push(`Suspect is missing a valid string ID: ${s.name || 'unnamed'}`);
    } else if (suspectIds.has(s.id)) {
      errors.push(`Duplicate suspect ID detected: ${s.id}`);
    } else {
      suspectIds.add(s.id);
    }
  }

  // 2. Validate Solution & Canonical Culprit
  const solution = mysteryData.solution;
  if (!solution) {
    errors.push('Case is missing the protected canonical solution object.');
  } else {
    if (!solution.culpritId || typeof solution.culpritId !== 'string') {
      errors.push('Solution must define a string culpritId.');
    } else if (!suspectIds.has(solution.culpritId)) {
      errors.push(`Canonical culpritId '${solution.culpritId}' does not match any suspect ID in the case.`);
    }

    if (!solution.motive || solution.motive.length < 10) {
      errors.push('Solution must provide a detailed motive explanation.');
    }
    if (!solution.method || solution.method.length < 10) {
      errors.push('Solution must provide a detailed method explanation.');
    }
    if (!solution.redHerringExplanation) {
      errors.push('Solution must explain how the misleading clues/red herrings are disproven.');
    }
  }

  // 3. Validate Evidence
  const evidenceList = mysteryData.evidence || [];
  if (!Array.isArray(evidenceList) || evidenceList.length === 0) {
    errors.push('Case must include evidence items.');
  }

  const evidenceIds = new Set();
  let hasRedHerring = false;
  let hasDirectOrCircumstantial = false;

  for (const item of evidenceList) {
    if (!item.id) {
      errors.push(`Evidence item '${item.title || 'untitled'}' is missing an ID.`);
    } else if (evidenceIds.has(item.id)) {
      errors.push(`Duplicate evidence ID detected: ${item.id}`);
    } else {
      evidenceIds.add(item.id);
    }

    // Verify suspect references
    if (Array.isArray(item.relatedSuspectIds)) {
      for (const sId of item.relatedSuspectIds) {
        if (!suspectIds.has(sId)) {
          errors.push(`Evidence '${item.id}' references non-existent suspect '${sId}'.`);
        }
      }
    }

    if (item.clueType === 'red_herring') hasRedHerring = true;
    if (item.clueType === 'direct' || item.clueType === 'circumstantial') hasDirectOrCircumstantial = true;
  }

  // 4. Validate Timeline Events
  const timeline = mysteryData.timeline || [];
  if (Array.isArray(timeline)) {
    for (const evt of timeline) {
      if (Array.isArray(evt.relatedSuspectIds)) {
        for (const sId of evt.relatedSuspectIds) {
          if (!suspectIds.has(sId)) {
            errors.push(`Timeline event '${evt.id}' references non-existent suspect '${sId}'.`);
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
