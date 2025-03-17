;; Bitcoin Mood Journal - Utilities
;; Helper functions for the Bitcoin Mood Journal

;; Mood types matching main contract
(define-constant MOOD_HAPPY u1)
(define-constant MOOD_SAD u2)
(define-constant MOOD_NEUTRAL u3)
(define-constant MOOD_ANXIOUS u4)
(define-constant MOOD_EXCITED u5)

;; Get human-readable mood name
(define-read-only (get-mood-name (mood-id uint))
  (if (is-eq mood-id MOOD_HAPPY)
    "Happy"
    (if (is-eq mood-id MOOD_SAD)
      "Sad"
      (if (is-eq mood-id MOOD_NEUTRAL)
        "Neutral"
        (if (is-eq mood-id MOOD_ANXIOUS)
          "Anxious"
          (if (is-eq mood-id MOOD_EXCITED)
            "Excited"
            "Unknown"
          )
        )
      )
    )
  )
)

;; Get text representation of mood
(define-read-only (get-mood-emoji (mood-id uint))
  (if (is-eq mood-id MOOD_HAPPY)
    "happy"
    (if (is-eq mood-id MOOD_SAD)
      "sad"
      (if (is-eq mood-id MOOD_NEUTRAL)
        "neutral"
        (if (is-eq mood-id MOOD_ANXIOUS)
          "anxious"
          (if (is-eq mood-id MOOD_EXCITED)
            "excited"
            "unknown"
          )
        )
      )
    )
  )
)

;; For the hackathon, we're simplifying by removing the format-entry-for-inscription function
;; since it's causing issues with string concatenation and we're short on time