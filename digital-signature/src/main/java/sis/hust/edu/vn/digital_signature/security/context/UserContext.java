package sis.hust.edu.vn.digital_signature.security.context;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import sis.hust.edu.vn.digital_signature.entity.model.User;
import sis.hust.edu.vn.digital_signature.repository.user.UserRepository;

@Service
@RequiredArgsConstructor
public class UserContext {

    private static final ThreadLocal<User> CURRENT_USER = new ThreadLocal<>();

    private final UserRepository userRepository;

    public void setCurrentUser(User user) {
        if (user != null) {
            CURRENT_USER.set(user);
        }
    }

    public User getCurrentUser() {
        User cachedUser = CURRENT_USER.get();
        if (cachedUser != null) {
            return cachedUser;
        }
        return resolveFromSecurityContext();
    }

    public String getCurrentUsername() {
        User cachedUser = CURRENT_USER.get();
        if (cachedUser != null) {
            return cachedUser.getUsername();
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        return null;
    }

    public void clear() {
        CURRENT_USER.remove();
    }

    private User resolveFromSecurityContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            return userRepository.findByUsername(username).orElse(null);
        }
        return null;
    }
}


