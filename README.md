# Computer Graphics - Assignment B

## Description

This repository contains the solution for Assignment B for the Computer Graphics course in the academic year 2023/2024. The goal of this assignment is to develop an interactive graphical application using Three.js, focusing on the following aspects:

1. **Scenes and Cameras**:
    - Setting up a scene with a light-colored background.
    - Implementing three fixed cameras with orthogonal projection (front, side, and top views).
    - Adding two additional fixed cameras (one with orthogonal projection and another with perspective projection).
    - Including a movable camera with perspective projection positioned on the crane's hook.

2. **Geometric Modeling**:
    - Modeling a simplified crane based on Three.js geometric primitives, with a transformation hierarchy to allow articulated movements.
    - Modeling an open container and several loads scattered around the scene.

3. **Animations and Interactivity**:
    - Controlling the crane to lift and position loads inside the container using specific keys.
    - Switching between wireframe and solid rendering modes.
    - Implementing collision detection between the crane claw and the loads, triggering movement animations.

4. **Heads-Up Display (HUD)**:
    - Including a HUD with a keymap for crane control.

## Objectives

- Understand and implement the architecture of an interactive graphical application.
- Explore geometric modeling concepts by instantiating primitives.
- Understand the use of virtual cameras and the differences between orthogonal and perspective projections.
- Apply basic animation techniques.
- Implement simple collision detection techniques.

## Usage Instructions

1. Clone the repository.
2. Install the necessary dependencies (Three.js).
3. Run the application on a local server.
4. Use the defined keys to operate the crane and interact with the scene.

## Notes

- The implementation uses the Three.js library without external libraries for collision detection or motion physics.
- The code follows good object-oriented programming practices to facilitate reuse and scalability.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/fabiogvdneto/ist-cgra-2024/blob/main/LICENSE) file for details.

---

For more information, you can refer to the complete assignment statement here: [Assignment B Statement](https://github.com/fabiogvdneto/ist-cgra-2024/blob/main/statement-B.pdf)
