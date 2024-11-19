import pygame
import random
import sys

# Initialize Pygame
pygame.init()

# Set up the game window
WINDOW_WIDTH = 400
WINDOW_HEIGHT = 600
WINDOW = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
pygame.display.set_caption('Flappy Bird')

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)

# Game variables
GRAVITY = 0.25
BIRD_MOVEMENT = 0
GAME_ACTIVE = True
SCORE = 0
HIGH_SCORE = 0

# Load and scale images
BIRD = pygame.Surface((40, 30))
BIRD.fill(BLUE)
PIPE = pygame.Surface((50, 300))
PIPE.fill(GREEN)

# Bird settings
bird_rect = BIRD.get_rect(center=(100, WINDOW_HEIGHT//2))

# Pipe settings
PIPE_LIST = []
SPAWN_PIPE = pygame.USEREVENT
pygame.time.set_timer(SPAWN_PIPE, 1200)
PIPE_HEIGHT = [300, 400, 500]

def create_pipe():
    random_pipe_pos = random.choice(PIPE_HEIGHT)
    bottom_pipe = PIPE.get_rect(midtop=(500, random_pipe_pos))
    top_pipe = PIPE.get_rect(midbottom=(500, random_pipe_pos - 200))
    return bottom_pipe, top_pipe

def move_pipes(pipes):
    for pipe in pipes:
        pipe.centerx -= 5
    return pipes

def draw_pipes(pipes):
    for pipe in pipes:
        if pipe.bottom >= WINDOW_HEIGHT:
            WINDOW.blit(PIPE, pipe)
        else:
            flip_pipe = pygame.transform.flip(PIPE, False, True)
            WINDOW.blit(flip_pipe, pipe)

def check_collision(pipes):
    for pipe in pipes:
        if bird_rect.colliderect(pipe):
            return False
    if bird_rect.top <= -100 or bird_rect.bottom >= WINDOW_HEIGHT:
        return False
    return True

def update_score(score, high_score):
    if score > high_score:
        high_score = score
    return high_score

# Game loop
clock = pygame.time.Clock()

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
            
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE and GAME_ACTIVE:
                BIRD_MOVEMENT = -7
            if event.key == pygame.K_SPACE and not GAME_ACTIVE:
                GAME_ACTIVE = True
                PIPE_LIST.clear()
                bird_rect.center = (100, WINDOW_HEIGHT//2)
                BIRD_MOVEMENT = 0
                SCORE = 0
                
        if event.type == SPAWN_PIPE and GAME_ACTIVE:
            PIPE_LIST.extend(create_pipe())
    
    WINDOW.fill(WHITE)
    
    if GAME_ACTIVE:
        # Bird movement
        BIRD_MOVEMENT += GRAVITY
        bird_rect.centery += BIRD_MOVEMENT
        WINDOW.blit(BIRD, bird_rect)
        
        # Pipes
        PIPE_LIST = move_pipes(PIPE_LIST)
        draw_pipes(PIPE_LIST)
        
        # Check for collisions
        GAME_ACTIVE = check_collision(PIPE_LIST)
        
        # Score
        for pipe in PIPE_LIST:
            if pipe.centerx == 100:
                SCORE += 0.5
    else:
        HIGH_SCORE = update_score(int(SCORE), HIGH_SCORE)
        
    # Draw score
    score_surface = pygame.font.Font(None, 36).render(f'Score: {int(SCORE)}', True, BLACK)
    score_rect = score_surface.get_rect(center=(WINDOW_WIDTH/2, 50))
    WINDOW.blit(score_surface, score_rect)
    
    if not GAME_ACTIVE:
        high_score_surface = pygame.font.Font(None, 36).render(f'High Score: {HIGH_SCORE}', True, BLACK)
        high_score_rect = high_score_surface.get_rect(center=(WINDOW_WIDTH/2, 100))
        WINDOW.blit(high_score_surface, high_score_rect)
    
    pygame.display.update()
    clock.tick(60)

