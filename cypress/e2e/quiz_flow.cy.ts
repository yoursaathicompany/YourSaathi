describe('Quiz Generation Flow', () => {
  it('should navigate from home to quiz play securely', () => {
    cy.visit('http://localhost:3000');
    
    // User sees the home page and clicks a category
    cy.contains('Mathematics & Logic').click();
    
    // Modal opens up
    cy.contains('Generate Quiz').should('be.visible');
    
    // Fill out form
    cy.get('input[type="text"]').clear().type('Calculus Limits');
    
    // Intercept API call to prevent actual Gemini usage during E2E test
    cy.intercept('POST', '/api/antigravity/generate-quiz', {
      statusCode: 200,
      body: {
        topic: 'Calculus Limits',
        difficulty: 'medium',
        student_level: 'college',
        questions: [
          {
            id: '1',
            type: 'mcq_single',
            question: 'What is the limit of x as x approaches 0?',
            options: ['0', '1', 'infinity', 'undefined'],
            correct_answer: '0',
            explanation: 'The limit of x as x approaches 0 is trivially 0.',
            hints: [],
            sources: [],
            tags: [],
            metadata: { estimated_time_seconds: 30, difficulty_score: 0.1, media: null }
          }
        ],
        meta: { num_questions_requested: 1, num_questions_returned: 1, estimated_total_time_seconds: 30, uniqueness_score: 1, confidence_score: 1 },
        summary: { question_count: 1, estimated_total_time_seconds: 30, difficulty_profile: { easy: 0, medium: 1, hard: 0 } },
        request_id: 'test-uuid',
        generated_at: new Date().toISOString()
      }
    }).as('generateQuiz');

    // Submit
    cy.contains('Generate Magic').click();
    cy.wait('@generateQuiz');

    // Should redirect to play area and show question
    cy.url().should('include', '/quiz/play');
    cy.contains('Calculus Limits').should('be.visible');
    cy.contains('What is the limit').should('be.visible');
    
    // Click answer
    cy.contains(/^0$/).click(); // matches strictly the option '0'
    
    // Submit answer
    cy.contains('Submit Answer').click();
    
    // Should show explanation
    cy.contains('Explanation').should('be.visible');
    
    // Click Finish Quiz
    cy.contains('Finish Quiz').click();
    
    // Results screen
    cy.contains('Quiz Complete!').should('be.visible');
    cy.contains('Score').should('be.visible');
    cy.contains('100%').should('be.visible');
  });
});
