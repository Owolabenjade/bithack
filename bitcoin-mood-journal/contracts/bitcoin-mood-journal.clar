;; Bitcoin Mood Journal - Main Contract
;; Store mood-tagged journal entries on Stacks blockchain
;; Author: Team MoodChain

;; Constants for mood types
(define-constant MOOD_HAPPY u1)
(define-constant MOOD_SAD u2)
(define-constant MOOD_NEUTRAL u3)
(define-constant MOOD_ANXIOUS u4)
(define-constant MOOD_EXCITED u5)

;; Error codes
(define-constant ERR_INVALID_MOOD u1000)
(define-constant ERR_NOT_ENTRY_OWNER u1001)
(define-constant ERR_ENTRY_NOT_FOUND u1002)

;; Data Variables
(define-data-var last-entry-id uint u0)

;; Maps to store entries
(define-map entries
  { entry-id: uint }
  {
    owner: principal,
    content: (string-utf8 250),
    mood: uint,
    timestamp: uint,
    inscription-id: (optional (string-utf8 64))
  }
)

;; Map to track user entries
(define-map user-entries
  { owner: principal }
  { entry-ids: (list 100 uint) }
)

;; Public Functions

;; Add a new journal entry
(define-public (add-entry (content (string-utf8 250)) (mood uint))
  (let
    (
      (new-id (+ (var-get last-entry-id) u1))
      (caller tx-sender)
      (user-entries-data (default-to { entry-ids: (list) } (map-get? user-entries { owner: caller })))
      (updated-entries (unwrap-panic (as-max-len? (append (get entry-ids user-entries-data) new-id) u100)))
    )
    (begin
      ;; Verify mood is valid
      (asserts! (is-valid-mood mood) (err ERR_INVALID_MOOD))
      
      ;; Store entry data
      (map-set entries
        { entry-id: new-id }
        {
          owner: caller,
          content: content,
          mood: mood,
          timestamp: block-height,
          inscription-id: none
        }
      )
      
      ;; Update user's entry list
      (map-set user-entries
        { owner: caller }
        { entry-ids: updated-entries }
      )
      
      ;; Update global counter
      (var-set last-entry-id new-id)
      
      ;; Return new entry ID
      (ok new-id)
    )
  )
)

;; Update an inscription ID for an entry (for when Ordinal is created)
(define-public (set-inscription-id (entry-id uint) (inscription-id (string-utf8 64)))
  (let
    (
      (entry (unwrap! (map-get? entries { entry-id: entry-id }) (err ERR_ENTRY_NOT_FOUND)))
      (caller tx-sender)
    )
    (begin
      ;; Verify caller is entry owner
      (asserts! (is-eq (get owner entry) caller) (err ERR_NOT_ENTRY_OWNER))
      
      ;; Update entry with inscription ID
      (map-set entries
        { entry-id: entry-id }
        (merge entry { inscription-id: (some inscription-id) })
      )
      
      (ok true)
    )
  )
)

;; Read-only Functions

;; Get a specific entry
(define-read-only (get-entry (entry-id uint))
  (map-get? entries { entry-id: entry-id })
)

;; Get all entry IDs for a user
(define-read-only (get-user-entry-ids (user principal))
  (default-to { entry-ids: (list) } (map-get? user-entries { owner: user }))
)

;; Get total number of entries
(define-read-only (get-entries-count)
  (var-get last-entry-id)
)

;; Private Functions

;; Validate mood type
(define-private (is-valid-mood (mood uint))
  (or
    (is-eq mood MOOD_HAPPY)
    (is-eq mood MOOD_SAD)
    (is-eq mood MOOD_NEUTRAL)
    (is-eq mood MOOD_ANXIOUS)
    (is-eq mood MOOD_EXCITED)
  )
)